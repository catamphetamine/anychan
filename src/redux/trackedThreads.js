import { ReduxModule } from 'react-pages'

import UserData from '../UserData/UserData'
import sortTrackedThreads from '../utility/sortTrackedThreads'

const redux = new ReduxModule('THREAD_TRACKER')

export const getTrackedThreads = redux.simpleAction(
	updateStateWithTrackedThreadsFromUserData
)

export const trackThread = redux.action(
	(thread, options = {}) => async () => {
		// Using a timestamp instead of a `Date` for `addedAt`
		// because of serialization/deserialization.
		// Custom `addedAt` parameter is supplied in cases when a user accidentally
		// untracks a thread by clicking the "x" button, and then clicks "Undo",
		// which re-calls `trackThread()` with the old `addedAt` timestamp parameter
		// so that the re-tracked thread is placed in its former place in the
		// tracked threads list (because the list is sorted by `addedAt` timestamp).
		thread.addedAt = options.addedAt || Date.now()
		UserData.addTrackedThread(thread)
		// Sort tracked threads.
		// Remove old expired tracked threads.
		sortAndTrimTrackedThreads()
	},
	updateStateWithTrackedThreadsFromUserData
)

export const untrackThread = redux.action(
	(thread) => async () => {
		UserData.removeTrackedThread(thread)
	},
	updateStateWithTrackedThreadsFromUserData
)

export default redux.reducer({
	...(typeof window === 'undefined' ? {} : updateStateWithTrackedThreadsFromUserData({}))
})

function updateStateWithTrackedThreadsFromUserData(state) {
	return {
		...state,
		trackedThreads: UserData.getTrackedThreadsList(),
		trackedThreadsIndex: UserData.getTrackedThreads()
	}
}

// Clean up expired threads a month after they've expired.
const CLEAN_UP_EXPIRED_THREADS_AFTER = 30 * 24 * 60 * 60 * 1000

/**
 * Sorts tracked threads.
 * Removes old expired tracked threads.
 */
function sortAndTrimTrackedThreads() {
	const trackedThreads = UserData.getTrackedThreadsList()
		.sort(sortTrackedThreads)
		.filter(({ expiredAt }) => expiredAt ? (Date.now() - expiredAt < CLEAN_UP_EXPIRED_THREADS_AFTER) : true)
	UserData.setTrackedThreadsList(trackedThreads)
}