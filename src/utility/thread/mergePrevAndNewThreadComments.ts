import type { Thread, Comment, GetCommentById } from '@/types'

import { isEqual } from 'lodash-es'

import createGetCommentById from './createGetCommentById.js'
import { ROOT_COMMENT_PROPERTIES_OF_A_THREAD } from '../../api/utility/addCommentProps.js'
import setRepliesOnComments from './setRepliesOnComments.js'

/**
 * Some comments might have been removed by moderators
 * in-between thread updates. This function preserves
 * such removed comments.
 * @param  {Thread} thread — Thread before the update. It will no longer be used.
 * @param  {Thread} updatedThread — Thread after being updated. It's gonna be the new thread to use.
 */
export default function mergePrevAndNewThreadComments(thread: Thread, updatedThread: Thread) {
	const prevReplyIds = thread.comments.map(_ => _.replyIds)

	// Replace `updatedThread`'s `.comments` with the old ones from `thread`,
	// but, at the same time, update those with the new comments data.
	// The comments whose data changed will get their "references" changed.
	mergeCommentLists(thread, updatedThread)

	// The scenario in which this function is used doesn't assume `thread.latestComments`
	// be present, because it's assumed to be a thread page, not a channel page.
	// Still, just for conceptual correctness, the "latest comments" case is handled here too,
	// even though it shouldn't really happen.
	const getCommentById = createGetCommentById(updatedThread)

	// Attempts to restore any removed comments from `inReplyToIdsRemoved` to `inReplyToIds`
	// if those removed comments are preserved in the previously fetched thread data.
	maybeRestoreSomeOfInReplyToIdsRemoved(thread, updatedThread, getCommentById)

	// Add new comment IDs to `replyIds` lists of old comments.
	// Uses `inReplyToIds` lists as a source for the data, so `inReplyToIds` have to
	// already be corrected at this point.
	updateReplyIdsOfOldComments(thread, updatedThread, getCommentById)

	// Re-create `.replies[]` from `.replyIds[]` of each comment.
	//
	// P.S.: Modifying the list of `.replies[]` of an older comment here
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
	//
	setRepliesOnComments(updatedThread, getCommentById)

	// Request a re-render of the first comment if some
	// of the rendered thread properties did change.
	updateFirstCommentWithNewThreadInfo(thread, updatedThread)

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

// Replaces `updatedThread`'s `.comments` with the old ones from `thread`,
// but, at the same time, updates those old comments with the refreshed data.
//
// The old comments whose data has changed will get their javascript object
// "references" changed: that's required in order to tell React to re-render those comments.
//
function mergeCommentLists(thread: Thread, updatedThread: Thread) {
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

// Adds new comment IDs to `replyIds` lists of old comments.
function updateReplyIdsOfOldComments(thread: Thread, updatedThread: Thread, getCommentById: GetCommentById) {
	// For each new comment.
	let i = thread.comments.length
	while (i < updatedThread.comments.length) {
		const newComment = updatedThread.comments[i]
		// If the new comment is a reply to some other comments.
		if (newComment.inReplyToIds) {
			// For each of those "other" comments.
			for (const inReplyToId of newComment.inReplyToIds) {
				const inReplyTo = getCommentById(inReplyToId)
				// Add the new comment ID to `replyIds` list of that "other" comment.
				if (!inReplyTo.replyIds) {
					inReplyTo.replyIds = []
				}
				inReplyTo.replyIds.push(newComment.id)
			}
		}
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
	// Only replaces the first comment if it has actually changed.
	// Keeping the old reference in case of no changes seems more "elegant".
	// For example, it won't cause a React re-render for the first comment element.
	if (firstCommentHasChanged) {
		// Changing the `comment` object reference wouldn't break
		// `virtual-scroller`'s "incremental" update detection
		// because `getItemId()` option/property is passed.
		updatedThread.comments[0] = { ...updatedThread.comments[0] }
	}
}

// If some of the old comments got removed, their IDs will be in `inReplyToIdsRemoved` lists
// rather than in `inReplyToIds` lists. But if those comments are preserved in the previously fetched thread data,
// those comments could be artificially restored, which is what this function does.
function maybeRestoreSomeOfInReplyToIdsRemoved(
	thread: Thread,
	updatedThread: Thread,
	getCommentById: GetCommentById
) {
	// Attempts to restore any removed comments from `inReplyToIdsRemoved` to `inReplyToIds`
	// if those removed comments are preserved in the previously fetched thread data.
	let i = thread.comments.length
	while (i < updatedThread.comments.length) {
		const comment = updatedThread.comments[i]
		if (comment.inReplyToIdsRemoved) {
			// `comment.inReplyToRemoved` will be mutated, hence the `.slice()`.
			// Otherwise, the `for of` cycle wouldn't work correctly and would skip some array items.
			for (const removedCommentId of comment.inReplyToIdsRemoved.slice()) {
				const removedComment = getCommentById(removedCommentId)
				// If the removed comment could be restored from the previously fetched data, then restore it.
				if (removedComment) {
					// Restore `removedCommentId` in `.inReplyToIds`.
					comment.inReplyToIds = comment.inReplyToIds || []
					comment.inReplyToIds.push(removedCommentId)
					// Remove `removedCommentId` from `.inReplyToRemoved`.
					comment.inReplyToIdsRemoved = comment.inReplyToIdsRemoved.filter(_ => _ !== removedCommentId)
					if (comment.inReplyToIdsRemoved.length === 0) {
						comment.inReplyToIdsRemoved = undefined
					}
				}
			}
		}
		i++
	}
}

// Updates the "references" to `comment`s whose `replies[]` lists have changed after the update.
// Updating the reference triggers a React re-render which updates the replies count on the screen.
function updateObjectReferencesForCommentsWhoseRepliesHaveChanged(
	updatedThread: Thread,
	prevReplyIds: Array<Array<Comment['id']>>
) {
	let i = 0
	while (i < prevReplyIds.length) {
		const comment = updatedThread.comments[i]
		// Uses `isEqual()` for code "brevity": otherwise, it would have to:
		// * Check new and old `replyIds` for being undefined
		// * Compare their lengths.
		if (!isEqual(comment.replyIds, prevReplyIds[i])) {
			updatedThread.comments[i] = { ...comment }
		}
		i++
	}
}