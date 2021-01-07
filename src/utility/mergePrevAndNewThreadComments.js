import isEqual from 'lodash/isEqual'

import createByIdIndex from './createByIdIndex'
import { FIRST_COMMENT_PROPERTIES_OF_A_THREAD } from '../api/utility/addCommentProps'

/**
 * Some comments might have been removed by moderators
 * in-between thread updates. This function preserves
 * such removed comments.
 * @param  {Thread} thread — Thread before being updated.
 * @param  {Thread} updatedThread — Thread after being updated. Its `comments` will be changed.
 */
export default function mergePrevAndNewThreadComments(thread, updatedThread) {
	// Replace `updatedThread`'s `.comments` with the old ones from `thread`,
	// but, at the same time, update those with the new comments data.
	// The comments whose data changed will get their "references" changed.
	updateCommentsWithNewCommentsData(thread, updatedThread)
	// Request a re-render of the first comment if some
	// of the rendered thread properties did change.
	updateFirstCommentWithNewThreadInfo(thread, updatedThread)
	// Re-generate the `.replies[]` for each comment, because:
	// a) If `updatedComment.replies` would have simply been copied over
	//    to `comment.replies`, they'd  still point to other `updatedComment`s,
	//    not other `comment`s. Aside from just being weird, that would result in
	//    unnecessarily re-parsing "parent" comments when calling `.parseContent()`
	//    on "new" comments.
	// b) Comments that have been removed aren't present in `updatedComment.replies`.
	const prevReplyIds = thread.comments.map(getReplyIds)
	const getCommentById = createByIdIndex(updatedThread.comments)
	updateInReplyToReferences(updatedThread, getCommentById)
	// Set `.replies[]` of each `comment`.
	setReplies(updatedThread)
	// Restore potentially removed comments in `inReplyTo`,
	// and update removed comments' `.replies[]`.
	restoreRemovedReplies(thread, updatedThread, getCommentById)
	// If there're any changes in `.replies[]` of a comment,
	// then update its reference so that it would get re-rendered.
	updateCommentReferencesOnRepliesChanged(updatedThread, prevReplyIds)
}

const UPDATEABLE_COMMENT_PROPERTIES = [
	// Update banned status, in case the author has been banned
	// for this comment in-between the refreshes.
	'authorBan',
	'authorBanReason',
	// Update upvotes/downvotes count.
	'upvotes',
	'downvotes',
	// User's vote on this comment
	'vote'
]

// Replace `updatedThread`'s `.comments` with the old ones from `thread`,
// but, at the same time, update those with the new comments data.
// The comments whose data changed will get their "references" changed.
function updateCommentsWithNewCommentsData(thread, updatedThread) {
	let i = 0
	while (i < thread.comments.length) {
		// Because the app uses `virtual-scroller`, it can optimize a bit
		// by keeping the reference to the old comment if it hasn't changed,
		// which will result in `VirtualScroller` not re-rendering that comment.
		// So, the code below looks at the updated comments and compares them to the old ones.
		// Also, the code below restores comments that have been deleted by moderators.
		const comment = thread.comments[i]
		const updatedComment = updatedThread.comments[i]
		// See if the comment is still there.
		if (comment.id === updatedComment.id) {
			// See if the comment has changed (not including `.content`).
			let commentHasChanged
			for (const property of UPDATEABLE_COMMENT_PROPERTIES) {
				if (updatedComment[property] !== comment[property]) {
					// There is a very small probability of an insignificant bug
					// when a user has voted for a comment right when the thread
					// was being refreshed, and, as a result, the user's vote
					// is first applied in the UI and then immediately reset
					// because the auto-updated thread data is a smallest bit stale.
					// But most likely almost no one would encounter such a bug.
					// There's no way to discern the user's vote from other users' votes anyway.
					comment[property] = updatedComment[property]
					commentHasChanged = true
				}
			}
			if (commentHasChanged) {
				console.log(`Comment #${comment.id} has changed.`)
				// Changing the `comment` object reference wouldn't break
				// `virtual-scroller`'s "incremental" update detection
				// because `getItemId()` option/property is passed.
				comment = { ...comment }
			}
			// Because updates to comment `.content` are ignored,
			// the `updatedAt` timestamp is ignored too.
			// comment.updatedAt = updatedThread.comments[i].updatedAt
			// Keep the reference to the "old" comment (with updated properties).
			updatedThread.comments[i] = comment
		} else {
			// console.log(`Comment #${comment.id} got removed. Restoring.`)
			// If a comment is skipped in the updated comments list,
			// then it means that the comment has been removed.
			// Restore such comment, and mark it as "removed".
			//
			// Changing the `comment` object reference wouldn't break
			// `virtual-scroller`'s "incremental" update detection
			// because `getItemId()` option/property is passed.
			//
			comment = {
				...comment,
				removed: true
			}
			// Restore the comment.
			updatedThread.comments.splice(i, 0, comment)
			// The `.replies[]` of this comment will be generated below.
		}
		i++
	}
}

function updateFirstCommentWithNewThreadInfo(thread, updatedThread) {
	let firstCommentHasChanged
	for (const property of FIRST_COMMENT_PROPERTIES_OF_A_THREAD) {
		if (updatedThread[property] !== thread[property]) {
			updatedThread.comments[0][property] = updatedThread[property]
			firstCommentHasChanged = true
		}
	}
	if (firstCommentHasChanged) {
		// Changing the `comment` object reference wouldn't break
		// `virtual-scroller`'s "incremental" update detection
		// because `getItemId()` option/property is passed.
		updatedThread.comments[0] = { ...updatedThread.comments[0] }
	}
}

function updateInReplyToReferences(updatedThread, getCommentById) {
	for (const comment of updatedThread.comments) {
		// Fix `comment.inReplyTo`.
		if (comment.inReplyTo) {
			// Convert `inReplyTo` objects to `inReplyTo` IDs,
			// because comment object references did change:
			// the re-fetched comment objects were discarded and replaced
			// with the old comment objects (whose properties got updated).
			// After that, `inReplyTo` IDs are re-converted back to comment objects.
			comment.inReplyTo = comment.inReplyTo.map(_ => _.id).map(getCommentById)
		}
	}
}

function setReplies(updatedThread) {
	// Reset `.replies[]` of each comment.
	for (const comment of updatedThread.comments) {
		comment.replies = undefined
	}
	// Set `.replies[]` of each `comment`.
	for (const comment of updatedThread.comments) {
		// Could reset `comment.replies = undefined` here,
		// but who knows what weird cases could there be
		// with users quoting comments from the future by
		// guessing their IDs. Could happen, hypothetically.
		// So, hypothetically, `comment.replies[]` could contain
		// not only comments after it but also comments before it.
		// That would be weird, but there're no restrictions on stuff like that.
		if (comment.inReplyTo) {
			for (const inReplyToComment of comment.inReplyTo) {
				inReplyToComment.replies = inReplyToComment.replies || []
				inReplyToComment.replies.push(comment)
			}
		}
	}
}

function restoreRemovedReplies(thread, updatedThread, getCommentById) {
	// If there're any new comments.
	if (updatedThread.comments.length > thread.comments.length) {
		// Restore potentially removed comments in `inReplyTo`,
		// and update removed comments' `.replies[]`.
		let i = thread.comments.length
		while (i < updatedThread.comments.length) {
			const comment = updatedThread.comments[i]
			if (comment.inReplyToRemoved) {
				// `comment.inReplyToRemoved` will be mutated, hence the `.slice()`.
				for (const removedCommentId of comment.inReplyToRemoved.slice()) {
					const removedComment = getCommentById(removedCommentId)
					if (removedComment) {
						// Restore the removed comment in `.inReplyTo`.
						if (comment.inReplyTo) {
							comment.inReplyTo.push(removedComment)
						} else {
							comment.inReplyTo = [removedComment]
						}
						// Remove `removedCommentId` from `.inReplyToRemoved`.
						comment.inReplyToRemoved = comment.inReplyToRemoved.filter(_ => _ !== removedCommentId)
						if (comment.inReplyToRemoved.length === 0) {
							comment.inReplyToRemoved = undefined
						}
						// Update the removed comment's `.replies`.
						if (removedComment.replies) {
							removedComment.replies.push(comment)
						} else {
							removedComment.replies = [comment]
						}
					}
				}
			}
			i++
		}
	}
}

function updateCommentReferencesOnRepliesChanged(updatedThread, prevReplyIds) {
	let i = 0
	while (i < prevReplyIds.length) {
		const comment = updatedThread.comments[i]
		const replyIds = getReplyIds(comment)
		if (!isEqual(replyIds, prevReplyIds[i])) {
			updatedThread.comments[i] = { ...comment }
		}
		i++
	}
}

function getReplyIds(comment) {
	if (comment.replies) {
		return comment.replies.map(_ => _.id)
	}
}