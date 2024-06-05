import type { Thread, UserData } from '@/types'

import findIndexByIdOrClosestPreviousOne from '../findIndexByIdOrClosestPreviousOne.js'

/**
 * Get the index of the latest read comment in a thread.
 * If the comment got removed, then returns the closest previous one (if any).
 * @param  {Thread} thread
 * @return {number} [i] Returns `undefined` if a suitable comment wasn't found.
 */
export default function getLatestReadCommentIndex(
	thread: Thread,
	{ userData }: { userData: UserData }
): number | undefined {
	// Show comments starting from the comment,
	// that's immediately after the latest read one.
	const latestReadCommentId = userData.getLatestReadCommentId(
		thread.channelId,
		thread.id
	)
	if (latestReadCommentId) {
		return findIndexByIdOrClosestPreviousOne(thread.comments, latestReadCommentId)
	}
}