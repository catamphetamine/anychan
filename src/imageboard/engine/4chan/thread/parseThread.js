/**
 * Parses chan API response for a thread.
 * @param  {object} response — Chan API response for a thread
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread({
	no,
	posts,
	replies,
	images,
	last_replies,
	omitted_images,
	closed,
	locked,
	sticky,
	cyclical,
	unique_ips,
	last_modified,
	bumplocked,
	bumplimit,
	imagelimit,
	custom_spoiler
}) {
	const thread = {
		// `no` is present in "get threads list" API response.
		// `posts[0].no` is present in "get thread comments" API response.
		id: no || posts[0].no,
		isSticky: sticky,
		// `4chan.org` has `closed` property.
		// `8ch.net` has `locked` property.
		isLocked: closed || locked,
		// `8ch.net` has `cyclical="0"` property.
		// I guess it's for "rolling" threads.
		// Seems that it's always "0" though.
		isRolling: cyclical === '1',
		commentsCount: replies,
		commentAttachmentsCount: getCommentAttachmentsCount(images, last_replies, omitted_images)
	}
	// Is present only in "get thread comments" API response.
	if (unique_ips) {
		thread.uniquePostersCount = unique_ips
	}
	// Is present only in "get threads list" API response.
	if (last_modified) {
		thread.updatedAt = new Date(last_modified * 1000)
	}
	// `8ch.net` has a concept of "bumplocked" threads that are in "autosage" mode.
	// https://twitter.com/infinitechan/status/555013038839848961
	// In other words, "bumplocked" threads are never bumped.
	// I guess it can be set both when a thread is created and later too.
	if (bumplocked === '1') {
		thread.isBumpLimitReached = true
	}
	// On `8ch.net` threads are marked as `bumplimit: 1` when
	// their technical "bump limit" is technically "reached".
	if (bumplimit === 1) {
		thread.isBumpLimitReached = true
	}
	if (imagelimit === 1) {
		thread.isAttachmentLimitReached = true
	}
	// At `4chan.org` each board can have a list of "custom spoilers" for attachments.
	// `custom_spoiler` is a number, and if it's `5`, for example, then it means that
	// the board has five custom spoilers defined: from `1` to `5`.
	// One can then choose any one of the available custom spoiler ids.
	// Custom spoiler URLs are: https://s.4cdn.org/image/spoiler-{boardId}{customSpoilerId}.png
	// Every time a new post is added to a thread the chosen custom spoiler id is rotated.
	// https://github.com/4chan/4chan-API
	if (custom_spoiler) {
		thread.customSpoilersCount = custom_spoiler
	}
	return thread
}

// https://github.com/vichan-devel/vichan/issues/327
// https://github.com/OpenIB/OpenIB/issues/295
// `kohlchan.net` and `8ch.net` both return incorrect `images` count:
// it can be `1` for a thread having `8` images, for example,
// with `omitted_images` being `7`, for example.
// This workaround kinda fixes that, but, for example, `kohlchan.net`
// still doesn't count video attachments as part of `images` and `omitted_images`.
function getCommentAttachmentsCount(images, last_replies, omitted_images) {
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
	if (last_replies) {
		for (const reply of last_replies) {
			if (reply.tim) {
				commentAttachmentsCount++
			}
		}
	}
	// Count "omitted" attachments count.
	// "omitted" means: "not in the main post and not in `last_replies` for 4chan".
	commentAttachmentsCount += omitted_images
	// `images` can't be `undefined` for all  currently supported 4chan-alike chans.
	if (images < commentAttachmentsCount) {
		return commentAttachmentsCount
	}
	return images
}