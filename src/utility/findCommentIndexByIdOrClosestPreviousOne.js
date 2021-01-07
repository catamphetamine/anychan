/**
 * Finds comment's index, or, if the comment has been deleted,
 * returns the index of the closest previous one (if any).
 * @param  {Thread} thread
 * @param  {number} commentId
 * @return {number} [i] Returns `undefined` if no appropriate match was found.
 */
export default function findCommentIndexByIdOrClosestPreviousOne(thread, commentId) {
	// Find latest read comment index.
	let i = thread.comments.length - 1
	while (i >= 0) {
		// A comment might have been deleted,
		// in which case find the closest previous one.
		if (thread.comments[i].id <= commentId) {
			return i
		}
		i--
	}
}