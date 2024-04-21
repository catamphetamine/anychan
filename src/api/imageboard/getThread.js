import getCommentLengthLimit from '../../utility/comment/getCommentLengthLimit.js'

export default async function getThreadFromImageboard(imageboard, {
	channelId,
	threadId,
	archived,
	afterCommentId,
	afterCommentsCount
}) {
	const thread = await imageboard.getThread({
		boardId: channelId,
		threadId
	}, {
		// The parser parses thread comments up to 4x faster without parsing their content.
		// Example: when parsing comments content — 650 ms, when not parsing comments content — 200 ms.
		parseContent: false,
		// Add `.parseContent()` function to each `comment`.
		addParseContent: true,
		commentLengthLimit: getCommentLengthLimit({ mode: 'thread' }),
		archived,
		// `afterCommentId`/`afterCommentsCount` feature is not currently used.
		afterCommentId,
		afterCommentsCount
	})

	// Rename `thread.boardId` -> `thread.channelId`.
	// `thread.boardId` is set by `imageboard` library.
	if (thread.boardId) {
		thread.channelId = thread.boardId
		delete thread.boardId
	}

	return {
		thread,
		hasMoreComments: false
	}
}