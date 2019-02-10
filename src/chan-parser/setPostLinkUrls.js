/**
 * Sets up post links.
 * @param {object[]} posts
 * @param {object} options
 */
export default function setPostLinkUrls(post, { boardId, threadId, messages }) {
	visitPostParts(
		'post-link',
		postLink => setPostLinkUrl(postLink, { boardId, threadId, messages }),
		post.content
	)
}

function setPostLinkUrl(postLink, { boardId, threadId, messages }) {
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

export function visitPostParts(type, visit, part) {
	if (Array.isArray(part)) {
		for (const subpart of part) {
			visitPostParts(type, visit, subpart)
		}
		return
	}
	// Post content can be empty.
	// Or maybe even post part's content.
	// Like `{ type: 'attachment', attachmentId: 1 }`.
	if (!part) {
		return
	}
	if (typeof part === 'string') {
		return
	}
	if (part.type === type) {
		return visit(part)
	}
	// Recurse into post parts.
	return visitPostParts(type, visit, part.content)
}
