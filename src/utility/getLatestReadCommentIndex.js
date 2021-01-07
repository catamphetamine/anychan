import UserData from '../UserData/UserData'

import findCommentIndexByIdOrClosestPreviousOne from './findCommentIndexByIdOrClosestPreviousOne'

/**
 * Get the index of the latest read comment in a thread.
 * If the comment got removed, then returns the closest previous one (if any).
 * @param  {Thread} thread
 * @return {number} [i] Returns `undefined`, if the comment wasn't found.
 */
export default function getLatestReadCommentIndex(thread) {
	// Show comments starting from the comment,
	// that's immediately after the latest read one.
	const latestReadCommentInfo = UserData.getLatestReadComment(thread.channelId, thread.id)
	if (latestReadCommentInfo) {
		return findCommentIndexByIdOrClosestPreviousOne(thread, latestReadCommentInfo.id)
	}
}