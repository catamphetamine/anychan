import parsePostLinks from './parsePostLinks'
import visitPostParts from 'webapp-frontend/src/utility/post/visitPostParts'

export default function getInReplyToPostIds(post, { boardId, threadId, commentUrlRegExp }) {
	if (post.rawContent) {
		return getInReplyToPostIdsForRawContent(post.rawContent, {
			boardId,
			threadId,
			commentUrlRegExp
		})
	} else if (post.content) {
		return getInReplyToPostIdsForParsedContent(post.content, {
			boardId,
			threadId
		})
	}
}

function getInReplyToPostIdsForRawContent(rawContent, { boardId, threadId, commentUrlRegExp }) {
	const links = parsePostLinks(rawContent, { commentUrlRegExp })
		.filter((link) => {
			return !link.boardId && !link.threadId ||
				(link.boardId === boardId) && (link.threadId === threadId)
		})
	if (links.length > 0) {
		return links.map(link => link.postId)
	}
}

function getInReplyToPostIdsForParsedContent(content, { boardId, threadId }) {
	let inReplyTo
	visitPostParts(
		'post-link',
		link => {
			if (link.boardId === boardId && link.threadId === threadId) {
				if (!inReplyTo) {
					inReplyTo = []
				}
				// Exclude duplicates.
				if (inReplyTo.indexOf(link.postId) < 0) {
					inReplyTo.push(link.postId)
				}
			}
		},
		content
	)
	return inReplyTo
}