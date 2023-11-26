import clearUnusedThreadsData from './clearUnusedThreadsData.js'
import fixSubscribedThreadsData from './fixSubscribedThreadsData.js'
import fixThreadCommentData from './fixThreadCommentData.js'
import Lock from '../utility/Lock.js'
import Storage from '../utility/storage/Storage.js'

import { TabStatusWatcher } from 'web-browser-tab/status-watcher'
import { Timer } from 'web-browser-timer'

const debug = (...args) => console.log(['UserDataCleaner'].concat(args))
const debugLock = (...args) => console.log(['UserDataCleaner.Lock'].concat(args))
// const debugTabStatusWatcher = (...args) => console.log(['UserDataCleaner.TabStatusWatcher'].concat(args))
const debugTabStatusWatcher = () => {}

const MINUTE = 60 * 1000
const DAY = 24 * 60 * MINUTE

// The maximum `setTimeout()` interval is about 24.8 days
// https://mrcoles.com/maximum-delay-settimeout/
export const RUN_INTERVAL = 24 * DAY

// Randomize clean-up start delay between different tabs
// so that multiple tabs don't start a clean-up simultaneously.
const START_DELAY_MAX = MINUTE

const RETRY_INTERVAL = MINUTE
const UNUSED_THREAD_DATA_LIFETIME = 3 * 30 * DAY

// How long could a clean-up process go on for.
const TIMEOUT = 15 * MINUTE

export default class UserDataCleaner {
	constructor({
		dispatch,
		userData,
		userSettings,
		storage,
		tabStatusWatcher = new TabStatusWatcher({
			log: debugTabStatusWatcher
		}),
		unusedThreadDataLifeTime = UNUSED_THREAD_DATA_LIFETIME,
		startDelayMax = START_DELAY_MAX,
		timer = new Timer()
	}) {
		this.userData = userData

		// Initialize storage.
		if (!storage) {
			storage = new Storage({
				dispatch,
				getLocale: userSettings && (() => userSettings.get('locale'))
			})
		}

		this.lock = new Lock('Clean-Up.Lock', {
			storage,
			timer,
			timeout: TIMEOUT,
			log: debugLock
		})

		this.tabStatusWatcher = tabStatusWatcher
		this.unusedThreadDataLifeTime = unusedThreadDataLifeTime
		this.startDelayMax = startDelayMax
		this.timer = timer
		this.log = debug

		this.tabStatusWatcher.onInactive(this.cancel)
	}

	start() {
		this.log('Start')

		this.tabStatusWatcher.start()

		this.requestCleanUp()
	}

	stop() {
		this.log('Stop')

		if (this.cleanUpTimer) {
			this.timer.cancel(this.cleanUpTimer)
			this.cleanUpTimer = undefined
		}

		this.tabStatusWatcher.stop()
	}

	cancel = () => {
		this.cancelled = true
	}

	getNextCleanUpDelay() {
		const cleanUpFinishedAt = this.userData.getCleanUpFinishedAt()
		if (cleanUpFinishedAt) {
			this.log('Previous clean-up finished at', new Date(cleanUpFinishedAt))
			const timeElapsedSincePreviousCleanUp = this.timer.now() - cleanUpFinishedAt
			if (timeElapsedSincePreviousCleanUp > RUN_INTERVAL) {
				this.log('Time to perform a new clean-up')
				return 0
			} else {
				const delay = RUN_INTERVAL - timeElapsedSincePreviousCleanUp
				this.log('Don\'t perform a new clean-up yet. Schedule next clean-up after', Math.ceil(delay / 1000), 'sec')
				return delay
			}
		} else {
			this.log('No previous clean-up. Start next clean-up immediately')
			return 0
		}
	}

	requestCleanUp() {
		this.log('Request a clean-up')
		this.schedule(this.getNextCleanUpDelay())
	}

	schedule(delay = 0) {
		// Randomize the delay so that if multiple tabs are open at once
		// they don't all attempt to clean up User Data simultaneously.
		delay += this.startDelayMax * Math.random()

		// If there should be no delay then clean up immediately.
		if (delay === 0) {
			this.clean()
			return
		}

		// Schedule a clean-up.
		this.log('Schedule a clean-up after', Math.ceil(delay / 1000), 'sec')
		this.cleanUpTimer = this.timer.schedule(
			// Using `async/await` here so that `timer` works correctly
			// when using it in tests with `.fastForward()`.
			async () => {
				this.cleanUpTimer = undefined
				await this.clean()
			},
			delay
		)
	}

	clean = async () => {
		try {
			await this._clean()
		} catch (error) {
			// Log the error, since clean-ups are ran in a timeout ("asynchronously"),
			// and therefore can be absent from the console output when running tests.
			console.error('Error while cleaning up User Data:')
			console.error(error)
			throw error
		}
	}

	_clean = async () => {
		this.log('Clean up')

		this.cancelled = false

		if (!this.tabStatusWatcher.isActive()) {
			this.log('Page inactive. Cancel clean-up')
			this.cancelled = true
			this.schedule(RETRY_INTERVAL)
			return
		}

		this.log('Acquire a lock')

		// Acquire a lock.
		const {
			// hasLockTimedOut,
			// getRetryDelayAfterLockTimedOut,
			releaseLock,
			retryAfter
		} = await this.lock.acquire()

		if (retryAfter) {
			this.log('Couldn\'t acquire a lock because it has already been acquired. Wait')
			this.cancelled = true
			this.schedule(retryAfter)
			return
		}

		// Check that some other tab hasn't finished a clean-up already.
		const nextCleanUpDelay = this.getNextCleanUpDelay()
		if (nextCleanUpDelay > 0) {
			this.log('Recent clean-up detected. Wait until it\'s time for the next clean-up.')
			releaseLock()
			this.schedule(nextCleanUpDelay)
			return
		}

		const clearUnusedThreads = clearUnusedThreadsData({
			userData: this.userData,
			unusedThreadDataLifeTime: this.unusedThreadDataLifeTime,
			timer: this.timer,
			log: debug
		})

		const fixSubscribedThreads = fixSubscribedThreadsData({
			userData: this.userData,
			log: debug
		})

		const fixThreadCommentData_ = fixThreadCommentData({
			userData: this.userData,
			log: debug
		})

		if (this.cancelled) {
			this.log('Clean-up interrupted')
			releaseLock()
			this.schedule(RETRY_INTERVAL)
			return
		}

		this.log('Clear unused threads data', 'Execute')
		clearUnusedThreads()

		this.log('Fix subscribed threads records', 'Execute')
		fixSubscribedThreads()

		this.log('Fix thread/comment data', 'Execute')
		fixThreadCommentData_()

		this.userData.flush()
		this.userData.setCleanUpFinishedAt(this.timer.now())

		this.log('Clean-up finished')
		releaseLock()
		this.requestCleanUp()
	}
}