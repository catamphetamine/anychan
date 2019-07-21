import parseComment from './parseComment'

import constructThread from '../../constructThread'

/**
 * Parses chan API response for a thread.
 * @param  {object} response — Chan API response for a thread
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread(posts, {
	chan,
	boardId,
	censoredWords,
	messages,
	isPreview,
	parseCommentPlugins,
	commentLengthLimit,
	getUrl,
	commentUrlRegExp,
	attachmentUrl,
	attachmentThumbnailUrl,
	// `8ch.net` has `fpath: 0/1` parameter.
	attachmentUrlFpath,
	attachmentThumbnailUrlFpath,
	fileAttachmentUrl,
	useRelativeUrls,
	chanUrl,
	defaultAuthorName,
	parseContent,
	expandReplies,
	addOnContentChange
}) {
	const thread = posts[0]
	const comments = posts.map(comment => parseComment(comment, {
		chan,
		boardId,
		censoredWords,
		messages,
		parseCommentPlugins,
		getUrl,
		commentUrlRegExp,
		attachmentUrl,
		attachmentThumbnailUrl,
		// `8ch.net` has `fpath: 0/1` parameter.
		attachmentUrlFpath,
		attachmentThumbnailUrlFpath,
		fileAttachmentUrl,
		useRelativeUrls,
		chanUrl,
		defaultAuthorName,
		parseContent,
		parseContentForOpeningPost: !isPreview
	}))
	const threadInfo = {
		boardId,
		commentsCount: thread.replies,
		commentAttachmentsCount: getCommentAttachmentsCount(thread)
	}
	// `4chan.org` has `closed` property.
	// `kohlchan.net` and `8ch.net` have `locked` property.
	if (thread.closed || thread.locked) {
		threadInfo.isLocked = true
	}
	if (thread.sticky) {
		threadInfo.isSticky = true
	}
	// `kohlchan.net` and `8ch.net` have `cyclical="0"` property.
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
	// `8ch.net` has a concept of "bumplocked" threads that are in "autosage" mode.
	// https://twitter.com/infinitechan/status/555013038839848961
	// In other words, "bumplocked" threads are never bumped.
	// I guess it can be set both when a thread is created and later too.
	if (thread.bumplocked === '1') {
		threadInfo.isBumpLimitReached = true
	}
	// On `8ch.net` threads are marked as `bumplimit: 1` when
	// their technical "bump limit" is technically "reached".
	if (thread.bumplimit === 1) {
		threadInfo.isBumpLimitReached = true
	}
	if (thread.imagelimit === 1) {
		threadInfo.isAttachmentLimitReached = true
	}
	// At `4chan.org` each board can have a list of "custom spoilers" for attachments.
	// `custom_spoiler` is a number, and if it's `5`, for example, then it means that
	// the board has five custom spoilers defined: from `1` to `5`.
	// One can then choose any one of the available custom spoiler ids.
	// Custom spoiler URLs are: https://s.4cdn.org/image/spoiler-{boardId}{customSpoilerId}.png
	// Every time a new post is added to a thread the chosen custom spoiler id is rotated.
	// https://github.com/4chan/4chan-API
	if (thread.custom_spoiler) {
		threadInfo.customSpoilersCount = thread.custom_spoiler
	}
	return constructThread(threadInfo, comments, {
		boardId,
		messages,
		commentLengthLimit,
		commentUrlRegExp,
		expandReplies,
		addOnContentChange
	})
}

// https://github.com/vichan-devel/vichan/issues/327
// https://github.com/OpenIB/OpenIB/issues/295
// `kohlchan.net` and `8ch.net` both return incorrect `images` count:
// it can be `1` for a thread having `8` images, for example,
// with `omitted_images` being `7`, for example.
// This workaround kinda fixes that, but, for example, `kohlchan.net`
// still doesn't count video attachments as part of `images` and `omitted_images`.
function getCommentAttachmentsCount(thread) {
	let commentAttachmentsCount = 0
	// The main post's attachments are not counted.
	// if (thread.tim) {
	// 	commentAttachmentsCount++
	// }
	// // `8ch.net` and `kohlchan.net` have `extra_files`.
	// // (allows more that one attachment per post).
	// if (thread.extra_files) {
	// 	for (const file of thread.extra_files) {
	// 		// if (!wasAttachmentDeleted(file)) {
	// 			commentAttachmentsCount++
	// 		// }
	// 	}
	// }
	// `4chan.org`'s "catalog.json" API has `last_replies`.
	// `4chan.org` supports only one attachment max per comment.
	if (thread.last_replies) {
		for (const reply of thread.last_replies) {
			if (reply.tim) {
				commentAttachmentsCount++
			}
		}
	}
	// Count "omitted" attachments count.
	// "omitted" means: "not in the main post and not in `last_replies` for 4chan".
	commentAttachmentsCount += thread.omitted_images
	// `images` can't be `undefined` for all  currently supported 4chan-alike chans.
	if (thread.images < commentAttachmentsCount) {
		return commentAttachmentsCount
	}
	return thread.images
}