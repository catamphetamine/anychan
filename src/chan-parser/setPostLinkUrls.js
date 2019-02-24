import visitPostParts from 'webapp-frontend/src/utility/post/visitPostParts'

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