import type { Imageboard, Thread as ImageboardThread } from 'imageboard'
import type { ThreadFromDataSource, GetThreadParameters, GetThreadResult, ChannelFromDataSource } from '@/types'

import getCommentLengthLimit from '../../utility/comment/getCommentLengthLimit.js'

export default async function getThreadFromImageboard(imageboard: Imageboard, {
	channelId,
	threadId,
	archived,
	afterCommentId,
	afterCommentNumber
}: GetThreadParameters): Promise<GetThreadResult> {
	const { thread: thread_, board } = await imageboard.getThread({
		boardId: channelId,
		threadId,
		// The parser parses thread comments up to 4x faster without parsing their content.
		// Example: when parsing comments content — 650 ms, when not parsing comments content — 200 ms.
		parseContent: false,
		// Add `.parseContent()` function to each `comment`.
		addParseContent: true,
		commentLengthLimit: getCommentLengthLimit({ mode: 'thread' }),
		archived,
		// `afterCommentId`/`afterCommentNumber` feature is not currently used.
		afterCommentId,
		afterCommentNumber
	})

	// Added this assignment in order to work around TypeScript type errors.
	// It will remove some properties specific to `imageboard` `Thread`
	// and it will add some properties specific to `anychan` Thread.
	const thread = thread_ as ThreadFromDataSource & ImageboardThread

	// Rename `thread.boardId` -> `thread.channelId`.
	// `thread.boardId` is set by `imageboard` library.
	if (thread.boardId) {
		thread.channelId = thread.boardId
		delete thread.boardId
	}

	// Added this assignment in order to work around TypeScript type errors.
	let channel: ChannelFromDataSource | undefined = board

	return {
		thread,
		hasMoreComments: false,
		channel
	}
}