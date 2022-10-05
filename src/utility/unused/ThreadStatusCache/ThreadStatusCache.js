import storage from '../storage/storage.js'
import getPrefix from '../storage/getStoragePrefix.js'
import onThreadArchived from '../thread/onThreadArchived.js'
import onThreadExpired from '../thread/onThreadExpired.js'

const STORAGE_KEY = getPrefix() + 'threadStatusEvent'

class ThreadStatusCache {
	cache = {}

	constructor({ dispatch }) {
		this.dispatch = dispatch

		this.log = (...args) => console.log(['ThreadStatusCache'].concat(args))

		// Receive changes from other windows or tabs.
		// Local storage events are received asynchronously,
		// hence the cache is "eventually consistent".
		// User Data has merging algorithms so "eventual consistency"
		// works in this case.
		this.removeStorageListener = storage.onExternalChange(({ key, value }) => {
			if (key === STORAGE_KEY) {
				this.log('Received update', value)
				this.onUpdate(value.channelId, value.threadId, value.status)
			}
		})
	}

	/**
	 * Returns cached thread status.
	 * Possible thread statuses: "active", "archived", "expired".
	 * The default is "active".
	 * @param  {string} channelId
	 * @param  {number} threadId
	 * @return {string}
	 */
	get(channelId, threadId) {
		const channelThreadsStatuses = this.cache[channelId]
		if (channelThreadsStatuses) {
			const threadStatus = channelThreadsStatuses[String(threadId)]
			if (threadStatus) {
				return threadStatus
			}
		}
		// Default to "active" thread state.
		return 'active'
	}

	_set(channelId, threadId, status) {
		if (!this.cache[channelId]) {
			this.cache[channelId] = {}
		}
		this.cache[channelId][String(threadId)] = status
	}

	/**
	 * Caches thread status.
	 * @param  {string} channelId
	 * @param  {number} threadId
	 * @param  {string} status
	 */
	set(channelId, threadId, status) {
		// See if thread status has changed.
		const prevStatus = this.get(channelId, threadId)
		if (prevStatus === status) {
			return
		}

		// Set the new thread status.
		this._set(channelId, threadId, status)

		// Broadcast the change to other windows or tabs.
		storage.set(STORAGE_KEY, {
			channelId,
			threadId,
			status
		})
	}

	/**
	 * Updates cached thread status when received a change event from other window or tab.
	 * @param  {string} channelId
	 * @param  {number} threadId
	 * @param  {string} status
	 */
	onUpdate(channelId, threadId, status) {
		// See if thread status has changed.
		const prevStatus = this.get(channelId, threadId)
		if (prevStatus === status) {
			return
		}

		// Update thread status in cache.
		this._set(channelId, threadId, status)

		// Call various updaters if thread status has changed.
		if (status === 'expired') {
			onThreadExpired(channelId, threadId, { dispatch: this.dispatch, fromCache: true })
		} else if (status === 'archived') {
			onThreadArchived(channelId, threadId, { dispatch: this.dispatch, fromCache: true })
		}
	}
}

let THREAD_STATUS_CACHE
export function startThreadStatusCache({ dispatch }) {
	THREAD_STATUS_CACHE = new ThreadStatusCache({ dispatch })
}

export default {
	get(...args) {
		return THREAD_STATUS_CACHE.get.apply(THREAD_STATUS_CACHE, args)
	},
	set(...args) {
		return THREAD_STATUS_CACHE.set.apply(THREAD_STATUS_CACHE, args)
	}
}