import type { UserData, UserSettings, DataSource, Channel, Thread, SubscribedThread, UserSettingsJson, Messages, ThreadFromDataSource } from '@/types'
import type { Dispatch } from 'redux'
import type { Storage as StorageType } from 'web-browser-storage'
import type { GetThreadParameters } from '../thread/getThread.js'

import { Tab } from 'web-browser-tab'
import { Timer } from 'web-browser-timer'

import { getThreadUsingCallback } from '../thread/getThread.js'
import getNextUpdateAtForThread from '../thread/getNextUpdateAtForThread.js'
import reportError from '../reportError.js'
import Storage from '../storage/Storage.js'
import StatusRecord from './SubscribedThreadsUpdater.StatusRecord.js'
import SubscribedThreadsUpdaterError from './SubscribedThreadsUpdaterError.js'

import getMessages from '../../messages/getMessages.js'

import type { StatusRecordValue } from './SubscribedThreadsUpdater.StatusRecord.js'

import {
	subscribedThreadsUpdateInProgressForThread,
	subscribedThreadsUpdateNotInProgress
} from '../../redux/subscribedThreads.js'

// Wait for a second between updating individual threads.
const WAIT_INTERVAL_BETWEEN_THREADS = 1000

const BACKGROUND_TAB_UPDATE_DELAY = 1000

// const BACKGROUND_TAB_UPDATE_DELAY_MIN = 1000
// const BACKGROUND_TAB_UPDATE_DELAY_MAX = 3000
// const BACKGROUND_TAB_UPDATE_RANDOMIZE_INTERVAL = 2000

const NEXT_UPDATE_RANDOMIZE_INTERVAL = 2000

// Background tabs will have `BACKGROUND_TAB_UPDATE_DELAY`
// added to this "wait for" interval.
const CONCURRENT_UPDATE_WAIT_FOR_INTERVAL = 2000

const debug = (...args: any[]) => console.log(['Subscribed Threads Updater'].concat(args))

export default class SubscribedThreadsUpdater {
	private tab: Tab
	private timer: Timer
	private userData: UserData
	private userSettings: UserSettings
	private dataSource: DataSource
	private dispatch: Dispatch
	private getThreadStub?: GetThreadStub
	private refreshThreadDelay?: number
	private createGetThreadParameters: CreateGetThreadParameters
	private nextUpdateRandomizeInterval: number
	private eventLog: object[]
	private log: (...args: any[]) => void
	private statusRecord: StatusRecord
	private _isActive?: boolean
	private _isUpdating?: boolean
	private _needsUpdate?: boolean
	private status?: Status
	private updateTimer?: number
	private refreshThreadDelayTimer?: number
	private unlistenPageHideEvent?: () => void

	constructor({
		tab,
		timer = new Timer(),
		userData,
		userSettings,
		dataSource,
		storage,
		dispatch,
		// `getThreadStub` parameter is currently only used in tests.
		getThreadStub,
		// `refreshThreadDelay` parameter is currently only used in tests.
		refreshThreadDelay,
		createGetThreadParameters,
		nextUpdateRandomizeInterval = NEXT_UPDATE_RANDOMIZE_INTERVAL,
		eventLog,
		log: logFunction = debug
	}: {
		tab?: Tab,
		timer?: Timer,
		userData: UserData,
		userSettings: UserSettings,
		dataSource: DataSource,
		storage?: StorageType<StatusRecordValue>,
		dispatch: Dispatch,
		getThreadStub?: GetThreadStub,
		refreshThreadDelay?: number,
		createGetThreadParameters?: CreateGetThreadParameters,
		nextUpdateRandomizeInterval?: number,
		eventLog?: object[],
		log?: (...args: any[]) => void
	}) {
		// Initialize storage.
		if (!storage) {
			storage = new Storage<StatusRecordValue>({
				dispatch,
				getLocale: userSettings && (() => userSettings.get('locale'))
			})
		}

		if (!tab) {
			tab = new Tab({ storage })
		}

		// When runing tests, `getThreadStub()` function is supplied.
		// That function doesn't use any of the `getThread()` parameters other than `channelId` and `threadId`.
		// In order for TypeScript to not complain about those parameters being not provided, it constructs
		// a fake `parameters` object here.
		if (getThreadStub) {
			createGetThreadParameters = () => ({
				censoredWords: [],
				grammarCorrection: false,
				originalDomain: null,
				locale: 'en',
				messages: getMessages('en')
			})
		}

		this.tab = tab
		this.timer = timer
		this.userData = userData
		this.userSettings = userSettings
		this.dataSource = dataSource
		this.dispatch = dispatch
		this.getThreadStub = getThreadStub
		this.refreshThreadDelay = refreshThreadDelay
		this.createGetThreadParameters = createGetThreadParameters
		this.nextUpdateRandomizeInterval = nextUpdateRandomizeInterval

		this.eventLog = eventLog
		this.log = (...args) => logFunction.apply(this, [this.tab.getId()].concat(args))

		this.statusRecord = new StatusRecord({
			timer,
			storage,
			processId: this.tab.getId(),
			onExternalChange(statusRecord?: StatusRecordValue) {
				if (statusRecord) {
					const { threadId, channelId } = statusRecord
					dispatch(subscribedThreadsUpdateInProgressForThread({
						threadId,
						channelId
					}))
				} else {
					dispatch(subscribedThreadsUpdateNotInProgress())
				}
			},
			log: this.log
		})
	}

	// Will return a `Promise` when started from an "active" tab.
	// (which is the case in tests)
	async start() {
		this.logEvent('START')
		this.log('Start')

		if (this._isActive) {
			throw new Error('[SubscribedThreadsUpdater] Can\'t start because it has already been started')
		}
		this._isActive = true

		this.tab.start()
		this.statusRecord.start()

		// Call `.stop()` on browser tab / window close.
		if (typeof window !== 'undefined') {
			const pageHideEventListener = () => this.stop()
			window.addEventListener('pagehide', pageHideEventListener)
			this.unlistenPageHideEvent = () => window.removeEventListener('pagehide', pageHideEventListener)
		}

		this.setStatus('START')

		// Will return a `Promise` when started from an "active" tab.
		// (which is the case in tests)
		await this.update()
	}

	stop() {
		this.logEvent('STOP')
		this.log('Stop')

		if (!this._isActive) {
			throw new Error('[SubscribedThreadsUpdater] Can\'t stop because it hasn\'t been started')
		}
		this._isActive = false

		this.tab.stop()
		this.statusRecord.stop()
		this.statusRecord.removeIfExists()

		this.stopScheduledUpdates()

		if (this.unlistenPageHideEvent) {
			this.unlistenPageHideEvent()
		}

		// Reset `this.refreshThreadDelayTimer`.
		// That timer is only used in tests.
		this.timer.cancel(this.refreshThreadDelayTimer)

		this.setStatus('STOP')
	}

	stopScheduledUpdates() {
		// Cancel the update timer.
		if (this.updateTimer) {
			this.timer.cancel(this.updateTimer)
			this.updateTimer = undefined
		}
	}

	// Will return a `Promise` when started from an "active" tab.
	// (which is the case in tests)
	async update() {
		this.logEvent('CHECK_IS_ACTIVE_TAB')
		// Attempt an update.
		if (this.tab.isActive()) {
			this.logEvent('IS_ACTIVE_TAB')
			// Returns a `Promise`.
			return await this._update()
		} else {
			this.logEvent('IS_INACTIVE_TAB')
			this.scheduleUpdateAfter(BACKGROUND_TAB_UPDATE_DELAY)
		}
	}

	// This method is called in cases when a new thread has been added
	// to a list of subscribed threads.
	async reset() {
		this.logEvent('RESET')
		this.stopScheduledUpdates()
		if (this._isUpdating) {
			this._needsUpdate = true
		} else {
			await this.update()
		}
	}

	scheduleUpdateAfter(delay: number) {
		this.logEvent('SCHEDULE_UPDATE')
		this.log('Schedule an update after', Math.floor(delay / 1000), 'seconds')

		// Randomize the `delay` until a next update so that
		// multiple tabs don't start updating at the same time.
		delay += Math.random() * this.nextUpdateRandomizeInterval

		this.updateTimer = this.timer.schedule(
			() => {
				this.updateTimer = undefined
				this._update()
			},
			delay
		)

		this.setStatus('SCHEDULED')
	}

	setStatus(status: Status) {
		this.log('Status', status)
		this.status = status
	}

	logEvent(event: LogEventName, parameters?: object) {
		if (this.eventLog) {
			this.eventLog.push({ event, ...parameters })
		}
	}

	async _update() {
		this.onUpdateStarted()

		this.log('See if there\'re any threads that should be updated now')

		const {
			subscribedThreadsToUpdate,
			nextUpdateAt
		} = this.getThreadsToUpdateNowAndNextUpdateTime()

		if (subscribedThreadsToUpdate.length > 0) {
			this.log(subscribedThreadsToUpdate.length + ' subscribed threads to update')

			await this.updateSubscribedThreads(subscribedThreadsToUpdate, {
				onUpdateEndedAcrossTabs: () => {
					this.dispatch(subscribedThreadsUpdateNotInProgress())
				},

				onUpdateInProgressAcrossTabs: (statusRecord: StatusRecordValue) => {
					this.dispatch(subscribedThreadsUpdateInProgressForThread({
						channelId: statusRecord.channelId,
						threadId: statusRecord.threadId
					}))
				},

				onUpdateFinished: ({ retryAfter }: { retryAfter?: number } = {}) => {
					if (retryAfter !== undefined) {
						this.onUpdateEnded({ retryAfter })
						return
					}

					this.log('See if anything should be updated after an update')

					const {
						subscribedThreadsToUpdate,
						nextUpdateAt
					} = this.getThreadsToUpdateNowAndNextUpdateTime()

					if (subscribedThreadsToUpdate.length > 0) {
						this.onUpdateEnded({ nextUpdateAt: this.timer.now() })
					} else {
						this.onUpdateEnded({ nextUpdateAt })
					}
				}
			})
		} else {
			this.logEvent('UPDATE_NOT_REQUIRED')
			this.log('No subscribed threads to update')
			this.onUpdateEnded({ nextUpdateAt })
			this.dispatch(subscribedThreadsUpdateNotInProgress())
		}
	}

	onUpdateStarted() {
		this.logEvent('UPDATE_START')
		this.log('Update', 'Start')
		this._isUpdating = true
		this.setStatus('UPDATE')
	}

	onUpdateEnded({
		retryAfter,
		nextUpdateAt
	}: {
		retryAfter?: number,
		nextUpdateAt?: number
	}) {
		this.logEvent('UPDATE_END')
		this.log('Update', 'End')
		this._isUpdating = false
		this.setStatus('IDLE')

		if (this._needsUpdate) {
			this._needsUpdate = false
			this.update()
			return
		}

		if (retryAfter) {
			this.scheduleUpdateAfter(retryAfter)
			return
		}

		if (nextUpdateAt !== undefined) {
			this.log('Next update at', new Date(nextUpdateAt))

			// Calculate "wait before the update" interval.
			// Should be `>= 0`.
			const delay = Math.max(nextUpdateAt - this.timer.now(), 0)
			this.scheduleUpdateAfter(delay)
			return
		}

		this.logEvent('END')
		this.log('No future updates will be made for these subscribed threads')
	}

	// Doesn't return anything.
	async updateSubscribedThreads(subscribedThreadsToUpdate: SubscribedThread[], {
		onUpdateFinished,
		onUpdateEndedAcrossTabs,
		onUpdateInProgressAcrossTabs
	}: {
		onUpdateFinished: (parameters?: { retryAfter?: number }) => void,
		onUpdateEndedAcrossTabs: () => void,
		onUpdateInProgressAcrossTabs: (statusRecord: StatusRecordValue) => void
	}) {
		const isAlreadyUpdatingThreads = () => {
			const statusRecord = this.statusRecord.get()
			if (statusRecord) {
				this.log('An update is in progress in another tab')
				onUpdateInProgressAcrossTabs(statusRecord)
				return true
			}
		}

		const waitAndRetry = ({ reason, error }: { reason: WaitAndRetryReason, error?: string }) => {
			this.logEvent('WAIT_AND_RETRY', { reason })
			this.log(`Wait and retry. Reason: ${reason}${error ? '. Error: ' + error : ''}`)
			onUpdateFinished({ retryAfter: CONCURRENT_UPDATE_WAIT_FOR_INTERVAL })
		}

		const startUpdatingThreadsIfNotAlreadyUpdating = async () => {
			// Some other tab may have started a subscribed threads update
			// while this function has been waiting for some `await`.
			//
			// Should always check for a concurrent subscribed threads update
			// that might be already in progress before calling `this.updateThreads()`.
			//
			if (isAlreadyUpdatingThreads()) {
				return waitAndRetry({ reason: 'CONCURRENT_UPDATE_IN_PROGRESS' })
			}

			// `SubscribedThreadsUpdater` was partially rewritten without `async`/`await`
			// and with using `callback`s instead. The reason is that `async`/`await`
			// or `Promise` don't work well with `timer.fastForward()` in tests.
			// So `async`/`await` and `Promise`s have been rewritten in `callback`s,
			// and tests now run correctly.
			await new Promise((resolve, reject) => {
				this.updateThreads(subscribedThreadsToUpdate, (error) => {
					if (error) {
						if (!(error instanceof SubscribedThreadsUpdaterError)) {
							return reject(error)
						}
						this.logEvent('ERROR')
						if (!error.message.startsWith('SUBSCRIBED_THREAD_UPDATER: STATUS_RECORD')) {
							reportError(error)
						}
						return waitAndRetry({ reason: 'ERROR', error: error.message })
					}

					onUpdateFinished()

					// Even though some other tab might've taken over the update process
					// due to this tab timing out, or something like that, still reset
					// the update process status. The update status will be re-set
					// one external changes to the local storage.
					onUpdateEndedAcrossTabs()

					resolve(undefined)
				})
			})
		}

		this.logEvent('CHECK_IS_ACTIVE_TAB')

		if (this.tab.isActive()) {
			this.logEvent('IS_ACTIVE_TAB')
			this.log('Is active tab')
			return await startUpdatingThreadsIfNotAlreadyUpdating()
		} else {
			this.logEvent('IS_INACTIVE_TAB')
		}

		if (isAlreadyUpdatingThreads()) {
			return waitAndRetry({ reason: 'CONCURRENT_UPDATE_IN_PROGRESS' })
		}

		this.logEvent('GET_ACTIVE_TAB')
		this.log('Get active tab')
		this.setStatus('GET_ACTIVE_TAB')
		const tabId = await this.tab.getActiveTabId()

		if (!tabId) {
			this.logEvent('NO_ACTIVE_TAB')
			this.log('No active tab')
			return await startUpdatingThreadsIfNotAlreadyUpdating()
		}

		if (tabId === this.tab.getId()) {
			this.logEvent('ACTIVE_TAB_THIS')
			this.log('Is active tab')
			return await startUpdatingThreadsIfNotAlreadyUpdating()
		}

		this.logEvent('ACTIVE_TAB_OTHER', { tabId })

		// The only purpose of this `if` is calling `isAlreadyUpdatingThreads()`
		// which, in turn, dispatches an "update in progress" action if there's
		// a concurrent update that is currently in progress.
		// So don't remove this `if`.
		if (isAlreadyUpdatingThreads()) {
			this.log('Some other tab is active and updating threads')
		} else {
			this.log('Some other tab is active')
		}

		return waitAndRetry({ reason: 'CONCURRENT_TAB_IS_ACTIVE' })
	}

	updateThreads(subscribedThreadsToUpdate: SubscribedThread[], callback: (error?: Error) => void) {
		this.logEvent('UPDATE_THREADS_START')

		// Create a status record.
		this.statusRecord.create((hasCreatedStatusRecord) => {
			if (!hasCreatedStatusRecord) {
				return callback(new SubscribedThreadsUpdaterError('SUBSCRIBED_THREAD_UPDATER: STATUS_RECORD: CREATE: LOCKED'))
			}
			this.log('Update threads')
			this.updateThreads_(subscribedThreadsToUpdate, callback)
		})
	}

	updateThreads_(subscribedThreadsToUpdate: SubscribedThread[], callback: (error?: Error) => void) {
		const [subscribedThread, ...restSubscribedThreads] = subscribedThreadsToUpdate

		const updateNextSubscribedThread = () => {
			if (restSubscribedThreads.length === 0) {
				this.log('Finished updating threads')
			} else {
				this.updateThreads_(restSubscribedThreads, callback)
			}
		}

		this.logEvent('UPDATE_THREAD', {
			threadId: subscribedThread.id,
			channelId: subscribedThread.channel.id
		})
		this.log('Thread', subscribedThread.id, 'in channel', subscribedThread.channel.id)

		// Check that the lock hasn't timed out.
		try {
			this.statusRecord.validateNotExpired()
		} catch (error) {
			return callback(error)
		}

		const refreshThread = (callback: (error?: Error) => void) => {
			// Refresh the thread.
			this.logEvent('FETCH_THREAD_START', {
				threadId: subscribedThread.id,
				channelId: subscribedThread.channel.id
			})
			this.log('Refresh thread', subscribedThread.id, 'in channel', subscribedThread.channel.id)

			const refreshThread_ = () => {
				this.refreshThread(subscribedThread, (error, result) => {
					if (error) {
						this.logEvent('FETCH_THREAD_ERROR', {
							threadId: subscribedThread.id,
							channelId: subscribedThread.channel.id
						})
						reportError(error)
						// Ignore the error and continue to the next thread.
						// For example, a thread could have expired or has been deleted by a moderator.
					}
					// Log the event.
					this.logEvent('FETCH_THREAD_END', {
						threadId: subscribedThread.id,
						channelId: subscribedThread.channel.id
					})
					callback()
				})
			}

			if (this.refreshThreadDelay) {
				this.log('Refresh thread delay', this.refreshThreadDelay)
				this.refreshThreadDelayTimer = this.timer.schedule(refreshThread_, this.refreshThreadDelay)
			} else {
				refreshThread_()
			}
		}

		const beforeRefreshThread = (callback: (error?: Error) => void) => {
			// Update status: "Updating thread X in channel Y".
			this.dispatch(subscribedThreadsUpdateInProgressForThread({
				threadId: subscribedThread.id,
				channelId: subscribedThread.channel.id
			}))
			try {
				this.statusRecord.update({
					threadId: subscribedThread.id,
					channelId: subscribedThread.channel.id
				})
				callback()
			} catch (error) {
				callback(error)
			}
		}

		const afterRefreshThread = (callback: (error?: Error) => void) => {
			// Update status: "Not updating any particular thread at the moment".
			this.dispatch(subscribedThreadsUpdateInProgressForThread({
				threadId: undefined,
				channelId: undefined
			}))
			try {
				this.statusRecord.update({
					threadId: undefined,
					channelId: undefined
				})
				callback()
			} catch (error) {
				callback(error)
			}
		}

		const finishedRefreshingThread = () => {
			// Wait before proceeding to the next one.
			if (restSubscribedThreads.length > 0) {
				this.logEvent('SCHEDULE_UPDATE_NEXT_THREAD')
				this.log('Wait between threads')
				return this.timer.schedule(updateNextSubscribedThread, WAIT_INTERVAL_BETWEEN_THREADS)
			}

			this.logEvent('UPDATE_THREADS_END')
			this.log('All threads have been updated')

			// Threads update finished.
			// Remove the status record.
			this.statusRecord.remove()

			this.log('Finished updating threads')
			callback()
		}

		beforeRefreshThread((error: Error) => {
			if (error) {
				return callback(error)
			}
			refreshThread((error: Error) => {
				if (error) {
					return callback(error)
				}
				// See if threads update has been cancelled.
				if (!this._isActive) {
					this.logEvent('WAS_CANCELLED')
					this.log('Cancelled')
					return callback(new SubscribedThreadsUpdaterError('CANCELLED'))
				}
				afterRefreshThread((error: Error) => {
					if (error) {
						return callback(error)
					}
					finishedRefreshingThread()
				})
			})
		})
	}

	getThreadsToUpdateNowAndNextUpdateTime() {
		const subscribedThreads = this.userData.getSubscribedThreads()
		const subscribedThreadsToUpdate = []

		let closestNextUpdateAt

		for (const subscribedThread of subscribedThreads) {
			if (subscribedThread.locked || subscribedThread.archived || subscribedThread.expired) {
				continue
			}

			const subscribedThreadState = this.userData.getSubscribedThreadState(
				subscribedThread.channel.id,
				subscribedThread.id
			)

			if (!subscribedThreadState) {
				console.error(`"subscribedThreadsState" record not found for subscribed thread "/${subscribedThread.channel.id}/${subscribedThread.id}"`)
			}

			let latestUpdateAt
			let latestCommentDate

			if (subscribedThreadState) {
				latestUpdateAt = subscribedThreadState.refreshedAt
				latestCommentDate = subscribedThreadState.latestComment.createdAt
			} else {
				latestUpdateAt = subscribedThread.addedAt
				latestCommentDate = subscribedThread.addedAt
			}

			const nextUpdateAt = getNextUpdateAtForThread(latestUpdateAt.getTime(), {
				latestCommentDate,
				refreshErrorDate: subscribedThreadState && subscribedThreadState.refreshErrorAt,
				refreshErrorCount:  subscribedThreadState && subscribedThreadState.refreshErrorCount,
				backgroundMode: true
			})

			if (nextUpdateAt <= this.timer.now()) {
				subscribedThreadsToUpdate.push(subscribedThread)
			} else {
				if (closestNextUpdateAt === undefined) {
					closestNextUpdateAt = nextUpdateAt
				} else {
					closestNextUpdateAt = Math.min(closestNextUpdateAt, nextUpdateAt)
				}
			}
		}

		return {
			nextUpdateAt: closestNextUpdateAt,
			subscribedThreadsToUpdate
		}
	}

	// `SubscribedThreadsUpdater` was partially rewritten without `async`/`await`
	// and with using `callback`s instead. The reason is that `async`/`await`
	// or `Promise` don't work well with `timer.fastForward()` in tests.
	// So `async`/`await` and `Promise`s have been rewritten in `callback`s,
	// and tests now run correctly.
	refreshThread(subscribedThread: SubscribedThread, callback: Parameters<typeof getThreadUsingCallback>[3]) {
		// `getThreadUsingCallback()` function also calls `onSubscribedThreadFetched()`
		// internally after the thread's data has been fetched.
		// Calling `onSubscribedThreadFetched()` is required in order to update
		// subscribed thread records with the updated info.
		getThreadUsingCallback(
			subscribedThread.channel.id,
			subscribedThread.id,
			{
				// `afterCommentId`/`afterCommentNumber` feature isn't currently used,
				// though it could potentially be used in some hypothetical future.
				// It would enable fetching only the "incremental" update
				// for the thread instead of fetching all of its comments.
				// afterCommentId: subscribedThreadState && subscribedThreadState.latestComment.id,
				// afterCommentNumber: subscribedThreadState && subscribedThreadState.commentsCount,
				...this.createGetThreadParameters(),
				dispatch: this.dispatch,
				userData: this.userData,
				userSettings: this.userSettings,
				dataSource: this.dataSource,
				timer: this.timer,
				purpose: this.getThreadStub ? 'getThreadStub' : 'getThread',
				getThreadStub: this.getThreadStub
			},
			callback
		)
	}
}

type Status = 'START' | 'STOP' | 'SCHEDULED' | 'UPDATE' | 'IDLE' | 'GET_ACTIVE_TAB';

type WaitAndRetryReason = 'CONCURRENT_UPDATE_IN_PROGRESS' | 'CONCURRENT_TAB_IS_ACTIVE' | 'ERROR';

type LogEventName =
	'START' |
	'STOP' |
	'CHECK_IS_ACTIVE_TAB' |
	'GET_ACTIVE_TAB' |
	'NO_ACTIVE_TAB' |
	'IS_ACTIVE_TAB' |
	'IS_INACTIVE_TAB' |
	'RESET' |
	'SCHEDULE_UPDATE' |
	'UPDATE_NOT_REQUIRED' |
	'UPDATE_START' |
	'UPDATE_END' |
	'END' |
	'WAIT_AND_RETRY' |
	'ERROR' |
	'ACTIVE_TAB_THIS' |
	'ACTIVE_TAB_OTHER' |
	'UPDATE_THREADS_START' |
	'UPDATE_THREAD' |
	'FETCH_THREAD_START' |
	'FETCH_THREAD_END' |
	'FETCH_THREAD_ERROR' |
	'SCHEDULE_UPDATE_NEXT_THREAD' |
	'UPDATE_THREADS_END' |
	'WAS_CANCELLED';

type CreateGetThreadParameters = () => Pick<GetThreadParameters,
	'channels' |
	'locale' |
	'originalDomain' |
	'grammarCorrection' |
	'censoredWords' |
	'messages'
>

type GetThreadStub = (parameters: {
	channelId: Channel['id'],
	threadId: Thread['id']
}) => Promise<{
	thread: Thread,
	channel?: Channel,
	hasMoreComments?: boolean
}>
