import parseComment from './parseComment'

import constructThread from '../constructThread'

/**
 * Parses chan API response for thread comments list.
 * @param  {object} thread — Chan API response thread object
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread(thread, posts, {
	boardId,
	filters,
	messages,
	defaultAuthorName,
	parseCommentPlugins,
	commentLengthLimit, // Max comment length until it generates a shortened preview.
	maxCommentLength, // Board-wide max comment length allowed by chan.
	maxAttachmentsSize,
	bumpLimit,
	commentsCount,
	commentAttachmentsCount,
	useRelativeUrls,
	getUrl
}) {
	let comments = posts.map(comment => parseComment(comment, {
		boardId,
		filters,
		messages,
		defaultAuthorName,
		parseCommentPlugins,
		useRelativeUrls,
		getUrl
	}))
	const threadInfo = {
		boardId,
		commentsCount,
		commentAttachmentsCount
	}
	const openingPost = posts[0]
	if (openingPost.closed === 1) {
		threadInfo.isClosed = true
	}
	// If the thread is pinned `sticky` will be a number greater than `0`.
	if (openingPost.sticky) {
		threadInfo.isSticky = true
	}
	// "Rolling" threads never go into "bump limit":
	// instead messages are being shifted from the start of
	// such thread as new messages are posted to it.
	// The "opening post" is always preserved.
	if (openingPost.endless === 1) {
		threadInfo.isRolling = true
	}
	if (commentsCount >= bumpLimit) {
		threadInfo.isBumpLimitReached = true
	}
	// Only for `/res/THREAD-ID.json` API response.
	if (thread.unique_posters) {
		threadInfo.uniquePostersCount = parseInt(thread.unique_posters)
	}
	// Is only used for `/res/THREAD-ID.json` API response.
	if (maxCommentLength) {
		threadInfo.maxCommentLength = maxCommentLength
	}
	// Is only used for `/res/THREAD-ID.json` API response.
	if (maxAttachmentsSize) {
		threadInfo.maxAttachmentsSize = maxAttachmentsSize
	}
	return constructThread(threadInfo, comments, {
		messages,
		commentLengthLimit
	})
}