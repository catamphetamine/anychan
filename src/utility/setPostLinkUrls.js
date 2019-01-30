/**
 * Sets post links.
 * @param {object[]} posts
 * @param {string} [threadId] — If passed then same page link URLs will be set (when appropriate).
 */
export default function setPostLinkUrls(post, threadId) {
	if (!post.content) {
		return
	}
	for (const postLink of findPostLinks(post.content)) {
		postLink.content = 'Сообщение'
		// Anchor links don't seem to work in the router.
		// https://github.com/4Catalyzer/found/issues/239
		// if (threadId === postLink.threadId) {
		// 	postLink.url = `#${postLink.postId}`
		// } else {
		// 	postLink.url = `/${postLink.boardId}/${postLink.threadId}#${postLink.postId}`
		// }
	}
}

function findPostLinks(part) {
	if (typeof part === 'string') {
		return
	}
	if (Array.isArray(part)) {
		return part.map(_ => findPostLinks(_)).filter(_ => _).reduce((links, _) => links.concat(_), [])
	}
	if (part.type === 'post-link') {
		return [part]
	}
}
