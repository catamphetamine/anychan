import type { Channel, Thread } from '@/types'
import type { Timer } from 'web-browser-timer'
import type { Storage } from 'web-browser-storage'

import { BASE_PREFIX } from '../storage/getStoragePrefix.js'
import SubscribedThreadsUpdaterError from './SubscribedThreadsUpdaterError.js'

export const STATUS_RECORD_STORAGE_KEY = BASE_PREFIX + 'subscribedThreadUpdate'

// Some web browsers limit `setTimeout()` delay to be 1 second minimum
// for background tabs.
// In that scenario, `3.5` seconds timeout would mean "3 tries",
// or, when accounted for the `STATUS_RECORD_CREATION_REPEATABLE_READ_CHECK_INTERVAL`,
// that would be "2 tries".
//
// Setting the timeout value to `30` seconds because an HTTP request
// could theorectially run for that long.
//
const STATUS_UPDATE_LISTENER_TIMEOUT = 30 * 1000

// After creating a status record, wait for a bit and then
// perform a "repeatable read" check: read the record
// and see if it's the same one, i.e. that it didn't get
// overwritten by some other concurrent contender.
//
// This way, if there're concurrent contenders for a lock,
// no more than a single one of them will acquire the lock.
//
// This interval will be increased to about 1 second for
// background tabs because of web browsers' "optimizations"
// of background tab activity. Therefore, `STATUS_UPDATE_LISTENER_TIMEOUT`
// interval should account for that (be long enough).
//
const STATUS_RECORD_CREATION_REPEATABLE_READ_CHECK_INTERVAL = 150

export interface StatusRecordValue {
	processId: string;
	createdAt: number;
	activeAt: number;
	startedAt?: number;
	channelId?: Channel['id'];
	threadId?: Thread['id'];
}

export default class StatusRecord {
	private timer: Timer
	private storage: Storage<StatusRecordValue>
	private processId: string
	private onExternalChange: (statusRecord?: StatusRecordValue) => void
	private log: (...args: any[]) => void
	private unlistenToStorageChanges: () => void

	constructor({
		timer,
		storage,
		processId,
		onExternalChange,
		log = () => {}
	}: {
		timer: Timer,
		storage: Storage<StatusRecordValue>,
		processId: string,
		onExternalChange: (statusRecord?: StatusRecordValue) => void,
		log: (...args: any[]) => void
	}) {
		this.timer = timer
		this.storage = storage
		this.processId = processId
		this.onExternalChange = onExternalChange

		this.log = (...args) => log.apply(this, ['Status Record'].concat(args))
	}

	start() {
		this.unlistenToStorageChanges = this.storage.onExternalChange(({ key, value }) => {
			if (key === STATUS_RECORD_STORAGE_KEY) {
				this.log('Has been changed externally', value)
				this.onExternalChange(value)
			}
		})
	}

	stop() {
		this.unlistenToStorageChanges()
	}

	validateNotExpired() {
		const statusRecord = this.get()
		if (statusRecord) {
			if (statusRecord.processId === this.processId) {
				return statusRecord
			}
		}
		throw new SubscribedThreadsUpdaterError('SUBSCRIBED_THREAD_UPDATER: STATUS_RECORD: VALIDATE: EXPIRED')
	}

	get() {
		this.log('Get')

		const statusRecord = this.storage.get(STATUS_RECORD_STORAGE_KEY)

		if (!statusRecord) {
			this.log('No other Subscribed Threads Update is in progress')
			return
		}

		const { processId, activeAt } = statusRecord

		if (this.timer.now() - activeAt > STATUS_UPDATE_LISTENER_TIMEOUT) {
			this.log((processId === this.processId ? 'External ' : '') + 'Subscribed Threads Update timed out')
			return
		}

		return statusRecord
	}

	create(callback: (hasAquiredLock: boolean) => void) {
		this.log('Create')

		const newStatusRecord = {
			processId: this.processId,
			createdAt: this.timer.now(),
			activeAt: this.timer.now()
		}

		// Attempt to acquire the "lock".
		this.storage.set(STATUS_RECORD_STORAGE_KEY, newStatusRecord)

		// This code will be executed after a short delay.
		const afterWaitForRepeatableRead = () => {
			// Check that the lock has been acquired.
			// For example, some other concurrent tab could accidentally overwrite it.
			const statusRecord = this.storage.get(STATUS_RECORD_STORAGE_KEY)

			const hasAquiredLock = isSameProcedure(newStatusRecord, statusRecord)

			if (hasAquiredLock) {
				this.log('Update Status Record: Lock acquired')
				this.storage.set(STATUS_RECORD_STORAGE_KEY, {
					...statusRecord,
					startedAt: this.timer.now()
				})
			} else {
				this.log('Update Status Record: Lock goes to some other concurrent updater')
			}

			// this.onStart()
			callback(hasAquiredLock)
		}

		// Wait a bit to detect possible "race conditions".
		this.timer.schedule(afterWaitForRepeatableRead, STATUS_RECORD_CREATION_REPEATABLE_READ_CHECK_INTERVAL)
	}

	update(properties: Partial<Omit<StatusRecordValue, 'activeAt'>>) {
		this.log('Update', properties)

		let statusRecord = this.storage.get(STATUS_RECORD_STORAGE_KEY)

		if (!statusRecord) {
			console.error('[SubscribedThreadsUpdater] Update Status Record: Not found')
			throw new SubscribedThreadsUpdaterError('SUBSCRIBED_THREAD_UPDATER: STATUS_RECORD: UPDATE: NOT_FOUND')
		}

		if (statusRecord.processId !== this.processId) {
			console.error('[SubscribedThreadsUpdater] Update Status Record: Subscribed threads update was taken over by another tab', statusRecord.processId)
			throw new SubscribedThreadsUpdaterError('SUBSCRIBED_THREAD_UPDATER: STATUS_RECORD: UPDATE: EXPIRED')
		}

		statusRecord = {
			...statusRecord,
			...properties,
			activeAt: this.timer.now()
		}

		this.storage.set(STATUS_RECORD_STORAGE_KEY, statusRecord)

		// this.onUpdate(properties)
	}

	remove({ ifExists }: { ifExists?: boolean } = {}) {
		this.log('Remove')

		// this.onEnd()

		const statusRecord = this.storage.get(STATUS_RECORD_STORAGE_KEY)

		if (!statusRecord) {
			if (ifExists) {
				return
			}
			console.error('[SubscribedThreadsUpdater] Delete Status Record: Not found')
			throw new SubscribedThreadsUpdaterError('SUBSCRIBED_THREAD_UPDATER: STATUS_RECORD: REMOVE: NOT_FOUND')
		}

		if (statusRecord.processId !== this.processId) {
			if (ifExists) {
				return
			}
			console.error('[SubscribedThreadsUpdater] Delete Status Record: Subscribed threads update was taken over by another tab', statusRecord.processId)
			throw new SubscribedThreadsUpdaterError('SUBSCRIBED_THREAD_UPDATER: STATUS_RECORD: REMOVE: EXPIRED')
		}

		this.storage.delete(STATUS_RECORD_STORAGE_KEY)
	}

	removeIfExists() {
		this.remove({ ifExists: true })
	}
}

function isSameProcedure(newStatusRecord: StatusRecordValue, statusRecord: StatusRecordValue) {
	return statusRecord.processId === newStatusRecord.processId &&
			statusRecord.createdAt === newStatusRecord.createdAt
}