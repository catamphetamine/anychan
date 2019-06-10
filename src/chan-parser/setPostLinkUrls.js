import visitPostParts from 'webapp-frontend/src/utility/post/visitPostParts'

/**
 * Sets `content`, `url`, `threadId` and `boardId`
 * of `{ type: 'post-link' }` objects.
 * @param {any} content — Post `content`
 * @param {object} options
 */
export default function setPostLinkUrls(content, { boardId, threadId, messages, getUrl }) {
	visitPostParts(
		'post-link',
		postLink => setPostLinkUrl(postLink, { boardId, threadId, messages, getUrl }),
		content
	)
}

function setPostLinkUrl(postLink, { boardId, threadId, messages, getUrl }) {
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
	postLink.url = getUrl(
		{ id: postLink.boardId },
		{ id: postLink.threadId },
		{ id: postLink.postId }
	)
}