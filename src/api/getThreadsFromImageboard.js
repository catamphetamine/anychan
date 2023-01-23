import Imageboard from './Imageboard.js'

import getCommentLengthLimit from '../utility/comment/getCommentLengthLimit.js'

const MAX_LATEST_COMMENTS_PAGES_COUNT = 2

export default async function getThreadsFromImageboard(channelId, {
	withLatestComments,
	sortByRating,
	messages,
	http,
	proxyUrl
}) {
	const imageboard = Imageboard({ messages, http, proxyUrl })

	const threads = await imageboard.getThreads({
		boardId: channelId
	}, {
		// The parser parses thread comments up to 4x faster without parsing their content.
		// Example: when parsing comments content — 650 ms, when not parsing comments content — 200 ms.
		parseContent: false,
		// Add `.parseContent()` function to each `comment`.
		addParseContent: true,
		commentLengthLimit: getCommentLengthLimit('channel'),
		latestCommentLengthLimit: getCommentLengthLimit('thread'),
		maxLatestCommentsPages: withLatestComments ? MAX_LATEST_COMMENTS_PAGES_COUNT : undefined,
		withLatestComments,
		sortByRating
	})

	// Rename `thread.boardId` -> `thread.channelId`.
	// `thread.boardId` is set by `imageboard` library.
	for (const thread of threads) {
		if (thread.boardId) {
			thread.channelId = thread.boardId
			delete thread.boardId
		}
	}

	return {
		threads,
		hasMoreThreads: false
	}
}