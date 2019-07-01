import parseComment from './parseComment'

import constructThread from '../constructThread'

/**
 * Parses chan API response for a thread.
 * @param  {object} response — Chan API response for a thread
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread(thread, {
	chan,
	boardId,
	filters,
	messages,
	isPreview,
	parseCommentPlugins,
	commentLengthLimit,
	getUrl,
	commentUrlRegExp,
	emojiUrl,
	attachmentUrl,
	attachmentThumbnailUrl,
	thumbnailSize,
	defaultAuthorName,
	parseContent,
	expandReplies,
	addOnContentChange
}) {
	const threadId = thread.threadId
	const comments = [thread].concat(thread.posts || []).map(comment => parseComment(comment, {
		chan,
		boardId,
		threadId,
		filters,
		messages,
		parseCommentPlugins,
		getUrl,
		commentUrlRegExp,
		emojiUrl,
		attachmentUrl,
		attachmentThumbnailUrl,
		thumbnailSize,
		defaultAuthorName,
		parseContent,
		parseContentForOpeningPost: !isPreview
	}))
	const threadInfo = {
		boardId,
		subject: thread.subject,
		commentsCount: thread.postCount,
		commentAttachmentsCount: thread.fileCount,
		// Non-standardized properties.
		maxFileCount: thread.maxFileCount, // Example: 4.
		// maxFileSize: parseFileSize(thread.maxFileSize), // Example: "128.00 MB".
		maxMessageLength: thread.maxMessageLength, // Example: 16384.
	}
	if (thread.locked) {
		threadInfo.isLocked = true
	}
	if (thread.pinned) {
		threadInfo.isSticky = true
	}
	if (thread.cyclic) {
		threadInfo.isRolling = true
	}
	// Only for `/catalog.json` API response.
	if (thread.lastBump) {
		threadInfo.lastModifiedAt = new Date(threadInfo.lastBump)
	}
	// `autoSage: true` can be set on a "sticky" thread for example.
	if (thread.autoSage) {
		threadInfo.isBumpLimitReached = true
	}
	return constructThread(threadInfo, comments, {
		boardId,
		messages,
		isPreview,
		commentLengthLimit,
		commentUrlRegExp,
		expandReplies,
		addOnContentChange
	})
}