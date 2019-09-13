/**
 * Parses chan API response for a thread.
 * @param  {object} response — Chan API response for a thread
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThread({
	threadId,
	subject,
	locked,
	pinned,
	cyclic,
	autoSage,
	lastBump,
	forceAnonymity,
	maxFileCount,
	maxMessageLength,
	postCount,
	fileCount,
	posts
}) {
	const thread = {
		id: threadId,
		title: subject,
		isLocked: locked,
		isSticky: pinned,
		isRolling: cyclic,
		// `lynxchan` doesn't provide neither `postCount`
		// nor `fileCount` in "get thread" API response.
		commentsCount: getCommentsCount(postCount, posts),
		commentAttachmentsCount: getCommentAttachmentsCount(fileCount, posts)
	}
	// `autoSage: true` can be set on a "sticky" thread for example.
	if (autoSage) {
		thread.isBumpLimitReached = true
	}
	// `lastBump` is only present in `/catalog.json` API response.
	if (lastBump) {
		thread.updatedAt = new Date(lastBump)
	}
	// Only for "get thread" API response.
	if (forceAnonymity) {
		// `forceAnonymity: true` disables author names in a thread:
		// forces empty/default `name` on all posts of a thread.
		thread.forceAnonymity = true
	}
	return thread
}

function getCommentsCount(postCount, posts) {
	// `lynxchan` doesn't provide neither `postCount`
	// nor `fileCount` in "get thread" API response.
	if (postCount === undefined) {
		// A workaround for `lynxchan` bug:
		// `lynxchan` doesn't return `postCount`
		// if there're no attachments in replies
		// in `/catalog.json` API response
		// which doesn't have `posts[]` property.
		if (posts) {
			return posts.length
		}
		return 0
	}
	return postCount
}

function getCommentAttachmentsCount(fileCount, posts) {
	// `lynxchan` doesn't provide neither `postCount`
	// nor `fileCount` in "get thread" API response.
	if (fileCount === undefined) {
		// A workaround for `lynxchan` bug:
		// `lynxchan` doesn't return `fileCount`
		// if there're no attachments in replies
		// in `/catalog.json` API response
		// which doesn't have `posts[]` property.
		if (posts) {
			return posts.reduce((total, post) => total + post.files.length, 0)
		}
		return 0
	}
	return fileCount
}