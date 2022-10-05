import getUserData from '../../UserData.js'

import findIndexByIdOrClosestPreviousOne from '../findIndexByIdOrClosestPreviousOne.js'

/**
 * Get the ID of the latest seen thread.
 * If the thread got removed, then returns the closest previous one (if any).
 * @param  {string} channelId
 * @param  {Thread[]} threads
 * @return {number} [id] Returns `undefined` if a suitable thread wasn't found.
 */
export default function getLatestSeenThreadId(channelId, threads, { userData = getUserData() } = {}) {
	// Show comments starting from the comment,
	// that's immediately after the latest read one.
	const latestSeenThreadId = userData.getLatestSeenThreadId(channelId)
	if (latestSeenThreadId) {
		const index = findIndexByIdOrClosestPreviousOne(threads, latestSeenThreadId)
		if (index !== undefined) {
			return threads[index].id
		}
	}
}