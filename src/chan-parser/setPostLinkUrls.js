/**
 * Sets post links.
 * @param {object[]} posts
 * @param {string} [threadId] — If passed then same page link URLs will be set (when appropriate).
 */
export default function setPostLinkUrls(post, { boardId, threadId, messages }) {
	if (!post.content) {
		return
	}
	for (const postLink of findPostLinks(post.content)) {
		postLink.content = getPostLinkContent(postLink, threadId, { messages })
		if (!postLink.boardId) {
			postLink.boardId = boardId
		}
		if (!postLink.threadId) {
			postLink.threadId = threadId
		}
		if (threadId === postLink.threadId) {
			postLink.url = `#comment-${postLink.postId}`
		} else {
			postLink.url = `/${postLink.boardId}/${postLink.threadId}#comment-${postLink.postId}`
		}
	}
}

function getPostLinkContent(postLink, threadId, { messages }) {
	if (postLink.postWasDeleted) {
		return messages.deletedPost
	}
	if (postLink.postIsHidden) {
		return messages.hiddenPost
	}
	return messages.quotedPost
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
