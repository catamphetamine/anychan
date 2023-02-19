/**
 * Tells if there're any new (unread) comments in a subscribed thread.
 * @param  {object} subscribedThread — Subscribed thread record from `UserData`.
 * @param  {object} [options.userData] — Custom `UserData` instance (is used in tests).
 * @return {boolean} Returns `false` if it's unknown whether there're any new comments. Could
 */
export default function doesSubscribedThreadHaveNewComments(subscribedThread, { userData }) {
	// If a thread has expired then don't show a "has new comments" icon.
	// The rationale is that the user won't be able to read those new comments anyway.
	if (subscribedThread.expired) {
		return false
	}

	const subscribedThreadStats = userData.getSubscribedThreadStats(subscribedThread.channel.id, subscribedThread.id)

	if (!subscribedThreadStats) {
		console.error(`"subscribedThreadsState" record not found for subscribed thread "/${subscribedThread.channel.id}/${subscribedThread.id}"`)
		return false
	}

	return subscribedThreadStats.newCommentsCount > 0
}

// export default function doesSubscribedThreadHaveNewComments(subscribedThread, { userData }) {
// 	// If a thread has expired then don't show a "has new comments" icon.
// 	// The rationale is that the user won't be able to read those new comments anyway.
// 	if (subscribedThread.expired) {
// 		return false
// 	}
//
// 	const latestReadComment = userData.getLatestReadComment(
// 		subscribedThread.channel.id,
// 		subscribedThread.id
// 	)
//
// 	// Technically, a thread might be subscribed to without any of its comments being read.
// 	// But those would be weird edge cases.
// 	// For example, if a thread's "original comment" is very long and not
// 	// limited by a "Read more" button, or if the screen height is small,
// 	// then the "original comment"'s bottom border might not have been visible
// 	// when the user added that thread to the list of subscribed threads,
// 	// and, therefore, such "long" "original comment" wouldn't be marked as "read"
// 	// until scrolled to its bottom.
// 	if (!latestReadComment) {
// 		return true
// 	}
//
// 	// Subscribed thread data is not always consistent:
// 	// its `latestComment` info is not necessarily in sync with the `commentsCount`.
// 	//
// 	// For example, the `/catalog.json` API response doesn't provide the IDs of a
// 	// thread's comments, so when a subscribed thread is updated from a `/catalog.json`
// 	// API response, its `latestComment` info doesn't get updated, because there's no
// 	// ID of the latest comment, but the `.commentsCount` propertly does get updated
// 	// because there is such info in that API response (unless it's a "trimming" thread).
// 	//
// 	// "Trimming" subscribed threads don't have their comments count or latest comment number
// 	// stored in subscribed thread data because that info would be pointless because
// 	// old comments constantly get erased as new comments are added.
// 	//
// 	// So, if `latestComment.id > latestReadComment.id`, then it means there're new unread comments.
// 	// But, if `latestComment.id <= latestReadComment.id`, then it doesn't mean that there aren't,
// 	// and a further `commentsCount` check has to be performed.
// 	//
// 	if (subscribedThread.latestComment.id > latestReadComment.id) {
// 		return true
// 	}
//
// 	// When a user navigates to the "catalog" page, there's no info on the
// 	// "latest comment" of a thread, but there is info on the total comments count
// 	// in a thread, so that info could be used to determine a probable "new comments" count.
// 	//
// 	// "Probable", because some comments might have been deleted by moderators,
// 	// which would result in "comments count" to not be in sync with comment numbers.
// 	//
// 	// For example, there were 2 comments in a thread, an the latest read comment
// 	// was "number 2", meaning that all comments have been read.
// 	// Then, after the next refresh, the thread has a new (third) comment,
// 	// but a moderator has also deleted the second comment, so the third
// 	// becomes the second, and even though there is now one new comment in the thread,
// 	// it's comments count remains the same, and this function won't be able to detect
// 	// that there're new comments.
// 	//
// 	// (A workaround would be not deleting the actual comments but rather replacing
// 	// their contents with `undefined` and marking them as "deleted").
// 	//
// 	// The "compare comments count" approach would work only for non-"trimming" threads.
// 	// "Trimming" threads are the ones where new comments overwrite older comments:
// 	// even when there're many new comments, the comments count stays the same
// 	// because old comments get deleted to maintain a constant "maximum" comments count.
// 	//
// 	if (!subscribedThread.trimming) {
// 		if (subscribedThread.commentsCount > latestReadComment.number) {
// 			return true
// 		}
// 	}
//
// 	return false
// }