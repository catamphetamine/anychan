import { ReduxModule } from 'react-pages'

import UserData from '../UserData/UserData'
import sortTrackedThreads from '../utility/sortTrackedThreads'

const redux = new ReduxModule('THREAD_TRACKER')

export const getTrackedThreads = redux.simpleAction(
	addTrackedThreadsData
)

export const trackThread = redux.action(
	(thread, options = {}) => async () => {
		// Just in case the thread both doesn't have a title
		// and a title wasn't autogenerated for some reason
		// (perhaps missing `messages` for "Picture", etc).
		if (!thread.title) {
			thread.title = `#${thread.id}`
		}
		// Using a timestamp instead of a `Date` because of
		// serialization/deserialization.
		// Can supply custom `addedAt`: for example, when a user
		// untracks a thread by accident and then clicks "Undo",
		// then the old `addedAt` is supplied so that the
		// re-tracked thread isn't placed at the top of the list.
		thread.addedAt = options.addedAt || Date.now()
		UserData.addTrackedThreadsList(thread)
		// Sort tracked threads.
		// Remove old expired tracked threads.
		sortAndTrimTrackedThreads()
	},
	addTrackedThreadsData
)

export const untrackThread = redux.action(
	(thread) => async () => {
		UserData.removeTrackedThreadsList(thread)
	},
	addTrackedThreadsData
)

redux.on('CHAN', 'GET_THREADS', (state, { boardId, threads }) => {
	// Clear expired threads from user data.
	UserData.updateThreads(boardId, threads)
	return addTrackedThreadsData(state)
})

export const threadExpired = redux.simpleAction(
	(state, { boardId, threadId }) => {
		UserData.onThreadExpired(boardId, threadId)
		return addTrackedThreadsData(state)
	}
)

export default redux.reducer({
	...(typeof window === 'undefined' ? {} : addTrackedThreadsData({}))
})

function addTrackedThreadsData(state) {
	return {
		...state,
		// Chrome seems to optimize `localStorage` access
		// by returning the same "reference" when getting
		// tracked threads list even after
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