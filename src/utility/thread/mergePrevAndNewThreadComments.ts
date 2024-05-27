import type { Thread, Comment, GetCommentById } from '@/types'

import { isEqual } from 'lodash-es'

import createByIdIndex from '../createByIdIndex.js'
import { ROOT_COMMENT_PROPERTIES_OF_A_THREAD } from '../../api/utility/addCommentProps.js'

/**
 * Some comments might have been removed by moderators
 * in-between thread updates. This function preserves
 * such removed comments.
 * @param  {Thread} thread — Thread before being updated.
 * @param  {Thread} updatedThread — Thread after being updated. Its `comments` will be changed.
 */
export default function mergePrevAndNewThreadComments(thread: Thread, updatedThread: Thread) {
	// Replace `updatedThread`'s `.comments` with the old ones from `thread`,
	// but, at the same time, update those with the new comments data.
	// The comments whose data changed will get their "references" changed.
	refreshOldCommentsAndRestoreRemovedOnes(thread, updatedThread)

	// Request a re-render of the first comment if some
	// of the rendered thread properties did change.
	updateFirstCommentWithNewThreadInfo(thread, updatedThread)

	// Re-generate the `.replies[]` for each comment, because:
	//
	// a) If `updatedComment.replies` would have simply been copied over
	//    to `comment.replies`, they'd  still point to other `updatedComment`s,
	//    not other `comment`s. Aside from just being weird, that would result in
	//    unnecessarily re-parsing "parent" comments when calling `.parseContent()`
	//    on "new" comments.
	//
	// b) Comments that have been removed aren't present in `updatedComment.replies`.

	const prevReplyIds = thread.comments.map(getReplyIds)

	// The scenario in which this function is used doesn't assume `thread.latestComments`
	// be present, because it's assumed to be a thread page, not a channel page.
	// Still, just for conceptual correctness, the "latest comments" case is handled here too,
	// even though it shouldn't really happen.
	const getCommentById = createByIdIndex(
		updatedThread.latestComments
			? updatedThread.comments.concat(updatedThread.latestComments)
			: updatedThread.comments
	)

	// If some of the old comments have changed, their javascript object "reference" has also changed.
	// But their old object "reference" is still present in some of the "parent" comments' `.inReplyTo[]`.
	// Update those old object "references" with new ones.
	fixInReplyToReferencesToOldCommentsWhoseObjectReferencesHaveChanged(updatedThread, getCommentById)

	// Re-create a `.replies[]` list for each `comment`.
	setReplies(updatedThread)

	// If some of the old comments got removed, they won't be present in `.inReplyTo[]` list.
	// This code fixes that by re-adding those removed comments to those lists.
	// Also it updates the removed comments' `.replies[]` by adding new replies there.
	fixInReplyToReferencesToRemovedComments(thread, updatedThread, getCommentById)

	// If there have been any changes in `.replies[]` of a comment,
	// then update the comment's "reference" so that it would get re-rendered.
	updateObjectReferencesForCommentsWhoseRepliesHaveChanged(updatedThread, prevReplyIds)
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
] as const

// Replace `updatedThread`'s `.comments` with the old ones from `thread`,
// but, at the same time, update those old comments with the refreshed data.
//
// The old comments whose data has changed will get their javascript object
// "references" changed: that's required in order for React to re-render those comments.
//
function refreshOldCommentsAndRestoreRemovedOnes(thread: Thread, updatedThread: Thread) {
	let i = 0
	while (i < thread.comments.length) {
		// Because the app uses `virtual-scroller`, it can optimize a bit
		// by keeping the reference to the old comment if it hasn't changed,
		// which will result in `VirtualScroller` not re-rendering that comment.
		// So, the code below looks at the updated comments and compares them to the old ones.
		// Also, the code below restores comments that have been deleted by moderators.
		let comment = thread.comments[i]
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
					// @ts-expect-error
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
		}
		else {
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

			// Fix `comment.index` because some of the older commments might have been removed.
			// For example, if the thread is a "trimming" one, then older comments get pushed off by newer ones.
			// Or, for example, a moderator might have removed a comment.
			comment.index = i

			// The `.replies[]` of this comment will be generated later.
		}

		i++
	}
}

function updateFirstCommentWithNewThreadInfo(thread: Thread, updatedThread: Thread) {
	let firstCommentHasChanged
	for (const property of ROOT_COMMENT_PROPERTIES_OF_A_THREAD) {
		if (updatedThread[property] !== thread[property]) {
			// @ts-expect-error
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

function fixInReplyToReferencesToOldCommentsWhoseObjectReferencesHaveChanged(
	updatedThread: Thread,
	getCommentById: GetCommentById
) {
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

function setReplies(updatedThread: Thread) {
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
				// Update `.replyIds` property.
				inReplyToComment.replyIds = inReplyToComment.replyIds || []
				inReplyToComment.replyIds.push(comment.id)

				// Update `.replies` property.
				inReplyToComment.replies = inReplyToComment.replies || []
				// Modifying the list of `.replies[]` of an older comment here
				// would result in a "jump of content" when such older comments'
				// replies list is expanded and those comments have already been
				// rendered by `virtual-scroller`, because the hight of the list of
				// their replies would change after a subsequent re-render.
				// `onItemHeightDidChange()` wouldn't solve the issue because
				// such expanded older comments could even be not rendered
				// at the time of the auto-update.
				// There seems to be no workaround for the issue so far.
				// Even though `onItemHeightDidChange()` wouldn't resolve the issue
				// in 100% of the cases, it could still resolve it in the cases
				// when such expanded older comments would currently be rendered,
				// so it would make sense to call it here, if anyone wants to do that
				// in some future.
				inReplyToComment.replies.push(comment)
			}
		}
	}
}


// If some of the old comments got removed, they won't be present
// in `.inReplyTo[]` lists of the new comments that're replies to
// those old removed comments.
// This function fixes that by re-adding those removed comments in their
// replies' `.inReplyTo[]` lists.
// Also updates the removed comments' lists of `.replies[]` by adding
// new replies there.
function fixInReplyToReferencesToRemovedComments(
	thread: Thread,
	updatedThread: Thread,
	getCommentById: GetCommentById
) {
	// If there're any new comments.
	if (updatedThread.comments.length > thread.comments.length) {
		// Restore potentially removed comments in `inReplyTo`,
		// and update removed comments' `.replies[]`.
		let i = thread.comments.length
		while (i < updatedThread.comments.length) {
			const comment = updatedThread.comments[i]
			if (comment.inReplyToIdsRemoved) {
				// `comment.inReplyToRemoved` will be mutated, hence the `.slice()`.
				for (const removedCommentId of comment.inReplyToIdsRemoved.slice()) {
					const removedComment = getCommentById(removedCommentId)
					if (removedComment) {
						// Restore `removedCommentId` in `.inReplyToIds`.
						comment.inReplyToIds = comment.inReplyToIds || []
						comment.inReplyToIds.push(removedCommentId)
						// Restore the removed comment in `.inReplyTo`.
						comment.inReplyTo = comment.inReplyTo || []
						comment.inReplyTo.push(removedComment)
						// Remove `removedCommentId` from `.inReplyToRemoved`.
						comment.inReplyToIdsRemoved = comment.inReplyToIdsRemoved.filter(_ => _ !== removedCommentId)
						if (comment.inReplyToIdsRemoved.length === 0) {
							comment.inReplyToIdsRemoved = undefined
						}
						// Update the removed comment's `.replyIds`.
						removedComment.replyIds = removedComment.replyIds || [];
						removedComment.replyIds.push(comment.id)
						// Update the removed comment's `.replies`.
						removedComment.replies = removedComment.replies || [];
						removedComment.replies.push(comment)
					}
				}
			}
			i++
		}
	}
}

function updateObjectReferencesForCommentsWhoseRepliesHaveChanged(
	updatedThread: Thread,
	prevReplyIds: Array<Array<Comment['id']>>
) {
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

function getReplyIds(comment: Comment) {
	if (comment.replies) {
		return comment.replies.map(_ => _.id)
	}
}