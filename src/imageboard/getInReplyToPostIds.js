import parsePostLinks from './parsePostLinks'
import visitPostParts from 'webapp-frontend/src/utility/post/visitPostParts'

export default function getInReplyToPostIds(post, {
	boardId,
	threadId,
	commentUrlParser,
	parseContent
}) {
	if (post.content) {
		if (parseContent === false) {
			return getInReplyToPostIdsForRawContent(post.content, {
				boardId,
				threadId,
				commentUrlParser
			})
		} else {
			return getInReplyToPostIdsForParsedContent(post.content, {
				boardId,
				threadId
			})
		}
	}
}

function getInReplyToPostIdsForRawContent(rawContent, {
	boardId,
	threadId,
	commentUrlParser
}) {
	const links = parsePostLinks(rawContent, { commentUrlParser })
		.filter((link) => {
			return !link.boardId && !link.threadId ||
				(link.boardId === boardId) && (link.threadId === threadId)
		})
	if (links.length > 0) {
		return links.map(link => link.postId)
	}
}

function getInReplyToPostIdsForParsedContent(content, {
	boardId,
	threadId
}) {
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