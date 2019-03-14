import parseComment from './parseComment'

import constructThread from '../constructThread'

/**
 * Parses chan API response for a thread.
 * @param  {object} response — Chan API response for a thread
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread(thread, posts, {
	boardId,
	filters,
	messages,
	parseCommentPlugins,
	commentLengthLimit,
	getUrl
}) {
	const comments = posts.map(comment => parseComment(comment, {
		boardId,
		filters,
		messages,
		parseCommentPlugins,
		getUrl
	}))
	const threadInfo = {
		boardId,
		commentsCount: thread.replies,
		attachmentsCount: thread.images
	}
	if (thread.closed === 1) {
		threadInfo.isClosed = true
	}
	if (thread.sticky === 1) {
		threadInfo.isSticky = true
	}
	// Only for `/thread/THREAD-ID.json` API response.
	if (thread.unique_ips) {
		threadInfo.uniquePostersCount = thread.unique_ips
	}
	// Only for `/catalog.json` API response.
	if (thread.last_modified) {
		threadInfo.lastModifiedAt = new Date(thread.last_modified * 1000)
	}
	if (thread.bumplimit === 1) {
		threadInfo.isBumpLimitReached = true
	}
	if (thread.imagelimit === 1) {
		threadInfo.isAttachmentLimitReached = true
	}
	if (thread.custom_spoiler === 1) {
		threadInfo.customSpoilerId = thread.custom_spoiler
	}
	return constructThread(threadInfo, comments, {
		messages,
		commentLengthLimit
	})
}