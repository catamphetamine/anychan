import { Tab } from 'web-browser-tab'
import { Timer } from 'web-browser-timer'

import getThread from '../thread/getThread.js'
import getNextUpdateAtForThread from '../thread/getNextUpdateAtForThread.js'
import reportError from '../reportError.js'
import storage_ from '../storage/storage.js'
import StatusRecord from './SubscribedThreadsUpdater.StatusRecord.js'

import {
	subscribedThreadsUpdateInProgress,
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

const debug = (...args) => console.log(['Subscribed Threads Updater'].concat(args))

export default class SubscribedThreadsUpdater {
	constructor({
		tab,
		timer = new Timer(),
		userData,
		userSettings,
		dataSource,
		storage = storage_,
		dispatch,
		// `getThreadStub` parameter is currently only used in tests.
		getThreadStub,
		// `createGetThreadParameters` parameter is set in `./src/utility/onApplicationStarted.js`.
		createGetThreadParameters = () => ({}),
		nextUpdateRandomizeInterval = NEXT_UPDATE_RANDOMIZE_INTERVAL
	}) {
		if (!tab) {
			tab = new Tab({ storage })
		}

		this.tab = tab
		this.timer = timer
		this.userData = userData
		this.userSettings = userSettings
		this.dataSource = dataSource
		this.dispatch = dispatch
		this.getThreadStub = getThreadStub
		this.createGetThreadParameters = createGetThreadParameters
		this.nextUpdateRandomizeInterval = nextUpdateRandomizeInterval

		this.log = (...args) => debug.apply(this, [this.tab.getId()].concat(args))

		this.statusRecord = new StatusRecord({
			timer,
			storage,
			processId: this.tab.getId(),
			onExternalChange(value) {
				if (value) {
					const { threadId, channelId } = value
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
		// Attempt an update.
		if (this.tab.isActive()) {
			// Returns a `Promise`.
			return await this._update()
		} else {
			this.scheduleUpdateAfter(BACKGROUND_TAB_UPDATE_DELAY)
		}
	}

	// This method is called in cases when a new thread has been added
	// to a list of subscribed threads.
	async reset() {
		this.stopScheduledUpdates()
		if (this._isUpdating) {
			this._needsUpdate = true
		} else {
			await this.update()
		}
	}

	scheduleUpdateAfter(delay) {
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

	setStatus(status, { reason } = {}) {
		this.status = status
		this.reason = reason
	}

	async _update() {
		this.onUpdateStarted()

		this.log('See if anything should be updated')

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

				onUpdateInProgressAcrossTabs: (statusRecord) => {
					this.dispatch(subscribedThreadsUpdateInProgressForThread({
						channelId: statusRecord.channelId,
						threadId: statusRecord.threadId
					}))
				},

				onUpdateFinished: ({ retryAfter } = {}) => {
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
			this.log('No subscribed threads to update')
			this.onUpdateEnded({ nextUpdateAt })
			this.dispatch(subscribedThreadsUpdateNotInProgress())
		}
	}

	onUpdateStarted() {
		this.log('Update', 'Start')
		this._isUpdating = true
		this.setStatus('UPDATE')
	}

	onUpdateEnded({ retryAfter, nextUpdateAt }) {
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

		this.log('No future updates will be made for these subscribed threads')
	}

	// Doesn't return anything.
	async updateSubscribedThreads(subscribedThreadsToUpdate, {
		onUpdateFinished,
		onUpdateEndedAcrossTabs,
		onUpdateInProgressAcrossTabs
	}) {
		const isAlreadyUpdatingThreads = () => {
			const statusRecord = this.statusRecord.get()
			if (statusRecord) {
				this.log('An update is in progress in another tab')
				onUpdateInProgressAcrossTabs(statusRecord)
				return true
			}
		}

		const waitAndRetry = ({ reason }) => {
			this.log(`Wait and retry. Reason: ${reason}`)
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

			try {
				await this.updateThreads(subscribedThreadsToUpdate)
				onUpdateFinished()
			} catch (error) {
				if (!error.message.startsWith('SUBSCRIBED_THREAD_UPDATER: STATUS_RECORD')) {
					reportError(error)
				}
				waitAndRetry({ reason: error.message })
			}

			// Even though some other tab might've taken over the update process
			// due to this tab timing out, or something like that, still reset
			// the update process status. The update status will be re-set
			// one external changes to the local storage.
			onUpdateEndedAcrossTabs()
		}

		if (this.tab.isActive()) {
			this.log('Is active tab')
			return startUpdatingThreadsIfNotAlreadyUpdating()
		}

		if (isAlreadyUpdatingThreads()) {
			return waitAndRetry({ reason: 'CONCURRENT_UPDATE_IN_PROGRESS' })
		}

		this.log('Get active tab')
		this.setStatus('GET_ACTIVE_TAB')
		const tabId = await this.tab.getActiveTabId()

		if (!tabId) {
			this.log('No active tab')
			return startUpdatingThreadsIfNotAlreadyUpdating()
		}

		if (tabId === this.tab.getId()) {
			this.log('Is active tab')
			return startUpdatingThreadsIfNotAlreadyUpdating()
		}

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

	async updateThreads(subscribedThreadsToUpdate) {
		// Create a status record.
		await this.statusRecord.create()

		this.log('Update threads')

		let i = 0
		for (const subscribedThread of subscribedThreadsToUpdate) {
			this.log('Thread', subscribedThread.id, 'in channel', subscribedThread.channel.id)

			// Check that the lock hasn't timed out.
			this.statusRecord.validateNotExpired()

			// Update status: "Updating thread X in channel Y".
			this.dispatch(subscribedThreadsUpdateInProgressForThread({
				threadId: subscribedThread.id,
				channelId: subscribedThread.channel.id
			}))
			this.statusRecord.update({
				threadId: subscribedThread.id,
				channelId: subscribedThread.channel.id
			})

			// Refresh the thread.
			this.log('Refresh thread', subscribedThread.id, 'in channel', subscribedThread.channel.id)
			try {
				await this.refreshThread(subscribedThread)
			} catch (error) {
				reportError(error)
				// See if threads update has been cancelled.
				if (!this._isActive) {
					this.log('Cancelled')
					return
				}
				// Ignore the error and continue to the next thread.
				// For example, a thread could have expired or has been deleted by a moderator.
				i++
				continue
			}

			// Update status: "Not updating any particular thread at the moment".
			this.dispatch(subscribedThreadsUpdateInProgressForThread({
				threadId: undefined,
				channelId: undefined
			}))
			this.statusRecord.update({
				threadId: undefined,
				channelId: undefined
			})

			// See if threads update has been cancelled.
			if (!this._isActive) {
				this.log('Cancelled')
				return
			}

			// Wait before proceeding to the next one.
			if (i < subscribedThreadsToUpdate.length - 1) {
				this.log('Wait between threads')
				await this.timer.waitFor(WAIT_INTERVAL_BETWEEN_THREADS)
			}
			else {
				this.log('All threads have been updated')

				// Threads update finished.
				// Remove the status record.
				this.statusRecord.remove()
			}

			i++
		}

		this.log('Finished updating threads')
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

	async refreshThread(subscribedThread) {
		// Calls `onSubscribedThreadFetched()` internally after the thread's data
		// has been fetched.
		// const subscribedThreadState = this.userData.getSubscribedThreadState(subscribedThread.channel.id, subscribedThread.id)
		await getThread({
			channelId: subscribedThread.channel.id,
			threadId: subscribedThread.id
		}, {
			// `afterCommentId`/`afterCommentsCount` feature isn't currently used,
			// though it could potentially be used in some hypothetical future.
			// It would enable fetching only the "incremental" update
			// for the thread instead of fetching all of its comments.
			// afterCommentId: subscribedThreadState && subscribedThreadState.latestComment.id,
			// afterCommentsCount: subscribedThreadState && subscribedThreadState.commentsCount,
			...this.createGetThreadParameters()
		}, {
			dispatch: this.dispatch,
			userData: this.userData,
			userSettings: this.userSettings,
			dataSource: this.dataSource,
			timer: this.timer,
			action: this.getThreadStub ? 'getThreadStub' : 'getThread',
			getThread: this.getThreadStub
		})
	}
}