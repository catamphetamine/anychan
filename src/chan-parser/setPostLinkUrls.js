/**
 * Sets up post links.
 * @param {object[]} posts
 * @param {object} options
 */
export default function setPostLinkUrls(post, { boardId, threadId, messages }) {
	if (!post.content) {
		return
	}
	for (const postLink of findPostLinks(post.content)) {
		// Set content.
		postLink.content = messages.quotedPost
		// Set board ID.
		if (!postLink.boardId) {
			postLink.boardId = boardId
		}
		// Set thread ID.
		if (!postLink.threadId) {
			postLink.threadId = threadId
		}
		// Set URL.
		if (threadId === postLink.threadId) {
			postLink.url = `#comment-${postLink.postId}`
		} else {
			postLink.url = `/${postLink.boardId}/${postLink.threadId}#comment-${postLink.postId}`
		}
	}
}

export function findPostLinks(part) {
	if (Array.isArray(part)) {
		return part.map(findPostLinks).reduce((links, _) => links.concat(_), [])
	}
	// Post content can be empty.
	// Or maybe even post part's content.
	// Like `{ type: 'attachment', attachmentId: 1 }`.
	if (!part) {
		return []
	}
	if (typeof part === 'string') {
		return []
	}
	if (part.type === 'post-link') {
		return [part]
	}
	// Recurse into post parts.
	return findPostLinks(part.content)
}
