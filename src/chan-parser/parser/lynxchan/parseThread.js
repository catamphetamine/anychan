import parseComment from './parseComment'

import constructThread from '../../constructThread'

/**
 * Parses chan API response for a thread.
 * @param  {object} response — Chan API response for a thread
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread(thread, {
	chan,
	boardId,
	censoredWords,
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
	addOnContentChange,
	toAbsoluteUrl
}) {
	const threadId = thread.threadId
	const comments = [thread].concat(thread.posts || []).map(comment => parseComment(comment, {
		chan,
		boardId,
		threadId,
		censoredWords,
		messages,
		parseCommentPlugins,
		getUrl,
		commentUrlRegExp,
		emojiUrl,
		attachmentUrl,
		attachmentThumbnailUrl,
		thumbnailSize,
		toAbsoluteUrl,
		defaultAuthorName,
		parseContent,
		parseContentForOpeningPost: !isPreview
	}))
	const threadInfo = {
		board: {
			id: boardId
		},
		title: thread.subject,
		// `lynxchan` doesn't provide neither `postCount`
		// nor `fileCount` in "get thread" API response.
		commentsCount: getCommentsCount(thread),
		commentAttachmentsCount: getCommentAttachmentsCount(thread)
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
	// `autoSage: true` can be set on a "sticky" thread for example.
	if (thread.autoSage) {
		threadInfo.isBumpLimitReached = true
	}
	// Only for `/catalog.json` API response.
	if (thread.lastBump) {
		threadInfo.lastModifiedAt = new Date(thread.lastBump)
	}
	// Only for "get thread" API response.
	if (thread.forceAnonymity) {
		// `forceAnonymity: true` disables author names in a thread:
		// forces empty/default `name` on all posts of a thread.
		threadInfo.forceAnonymity = true
	}
	// Non-standardized property.
	// Only for "get thread" API response.
	if (thread.maxFileCount !== undefined) {
		// Example: 4.
		threadInfo.maxAttachments = thread.maxFileCount
	}
	// Non-standardized property.
	// Only for "get thread" API response.
	// if (thread.parseFileSize !== undefined) {
	// 	// Example: "128.00 MB".
	// 	threadInfo.maxFileSize = parseFileSize(thread.parseFileSize)
	// }
	// Non-standardized property.
	// Only for "get thread" API response.
	if (thread.maxMessageLength !== undefined) {
		// Example: 16384.
		threadInfo.maxCommentLength = thread.maxMessageLength
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

function getCommentsCount(thread) {
	// `lynxchan` doesn't provide neither `postCount`
	// nor `fileCount` in "get thread" API response.
	if (thread.postCount === undefined) {
		// A workaround for `lynxchan` bug:
		// `lynxchan` doesn't return `postCount`
		// if there're no attachments in replies
		// in `/catalog.json` API response
		// which doesn't have `posts[]` property.
		if (thread.posts) {
			return thread.posts.length
		}
		return 0
	}
	return thread.postCount
}

function getCommentAttachmentsCount(thread) {
	// `lynxchan` doesn't provide neither `postCount`
	// nor `fileCount` in "get thread" API response.
	if (thread.fileCount === undefined) {
		// A workaround for `lynxchan` bug:
		// `lynxchan` doesn't return `fileCount`
		// if there're no attachments in replies
		// in `/catalog.json` API response
		// which doesn't have `posts[]` property.
		if (thread.posts) {
			return thread.posts.reduce((total, post) => total + post.files.length, 0)
		}
		return 0
	}
	return thread.fileCount
}