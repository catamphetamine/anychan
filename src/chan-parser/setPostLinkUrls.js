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
		postLink.content = getPostLinkContent(postLink, threadId)
		if (threadId === postLink.threadId) {
			postLink.url = `#${postLink.postId}`
		} else {
			postLink.url = `/${postLink.boardId}/${postLink.threadId}#${postLink.postId}`
		}
	}
}

function getPostLinkContent(postLink, threadId) {
	if (postLink.threadId === threadId && postLink.postWasDeleted) {
		return 'Удалённое сообщение'
	}
	if (postLink.post && postLink.postIsHidden) {
		return 'Скрытое сообщение'
	}
	return 'Сообщение'
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
