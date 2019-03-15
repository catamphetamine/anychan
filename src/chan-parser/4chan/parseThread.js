import parseComment from './parseComment'

import constructThread from '../constructThread'

/**
 * Parses chan API response for a thread.
 * @param  {object} response — Chan API response for a thread
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread(posts, {
	boardId,
	filters,
	messages,
	parseCommentPlugins,
	commentLengthLimit,
	getUrl,
	commentUrlRegExp,
	attachmentUrl,
	attachmentThumbnailUrl,
	defaultAuthorName
}) {
	const thread = posts[0]
	const comments = posts.map(comment => parseComment(comment, {
		boardId,
		filters,
		messages,
		parseCommentPlugins,
		getUrl,
		commentUrlRegExp,
		attachmentUrl,
		attachmentThumbnailUrl,
		defaultAuthorName
	}))
	const threadInfo = {
		boardId,
		commentsCount: thread.replies,
		attachmentsCount: thread.images
	}
	// `4chan.org` has `closed` property.
	// `kohlchan.net` has `locked` property.
	if (thread.closed === 1 || thread.locked) {
		threadInfo.isClosed = true
	}
	if (thread.sticky === 1) {
		threadInfo.isSticky = true
	}
	// `kohlchan.net` has `cyclical="0"` property.
	// I guess it's for "rolling" threads.
	// Seems that it's always "0" though.
	if (thread.cyclical === '1') {
		threadInfo.isRolling = true
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