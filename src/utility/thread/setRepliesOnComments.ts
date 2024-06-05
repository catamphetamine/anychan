import { Thread, GetCommentById } from '@/types'

import createGetCommentById from './createGetCommentById.js'

// Expands `inReplyToIds` / `replyIds` lists of IDs into lists of comment objects.
// Mutates the original `thread`.
// Returns the `thread` for convenience.
export default function setRepliesOnComments(thread: Thread, getCommentById?: GetCommentById) {
	if (!getCommentById) {
		getCommentById = createGetCommentById(thread)
	}

	for (const comment of thread.comments) {
		// Re-create `.replies[]` from `.replyIds[]`.
		if (comment.replyIds) {
			comment.replies = comment.replyIds.map(getCommentById)
				// Skip not found comments. For example, some comments may have been deleted
				// or users might've been inputting "fake" comment IDs in their comment text.
				.filter(_ => _)
		}
	}

	return thread
}