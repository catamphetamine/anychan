import visitPostParts from 'webapp-frontend/src/utility/post/visitPostParts'

/**
 * Sets `content`, `url`, `threadId` and `boardId`
 * of `{ type: 'post-link' }` objects.
 * @param {any} content — Post `content`
 * @param {object} options
 */
export default function setPostLinkUrls(content, { boardId, threadId, messages, commentUrl }) {
	visitPostParts(
		'post-link',
		postLink => setPostLinkUrl(postLink, { boardId, threadId, messages, commentUrl }),
		content
	)
}

function setPostLinkUrl(postLink, { boardId, threadId, messages, commentUrl }) {
	// Set content.
	postLink.content = messages.quotedComment
	// Set board ID.
	if (!postLink.boardId) {
		postLink.boardId = boardId
	}
	// Set thread ID.
	if (!postLink.threadId) {
		postLink.threadId = threadId
	}
	// Set URL.
	postLink.url = commentUrl
		.replace('{boardId}', postLink.boardId)
		.replace('{threadId}', postLink.threadId)
		.replace('{commentId}', postLink.postId)
}