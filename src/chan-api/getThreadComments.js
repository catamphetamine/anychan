import {
	getChan,
	getAbsoluteUrl,
	getChanParserSettings
} from '../chan'

import createParser from './createParser'
import getProxyUrl from './getProxyUrl'
import setThreadInfo from './setThreadInfo'
import configuration from '../configuration'

import getPostText from 'webapp-frontend/src/utility/post/getPostText'
import trimText from 'webapp-frontend/src/utility/post/trimText'

export default async function getThreadComments({
	boardId,
	threadId,
	censoredWords,
	messages,
	http
}) {
	const apiRequestStartedAt = Date.now()
	const response = await http.get(getProxyUrl(
		getAbsoluteUrl(getChanParserSettings().api.getThread)
			.replace('{boardId}', boardId)
			.replace('{threadId}', threadId)
	))
	console.log(`Get thread API request finished in ${(Date.now() - apiRequestStartedAt) / 1000} secs`)
	const startedAt = Date.now()
	const thread = createParser({ censoredWords, messages }).parseThread(response, {
		boardId,
		// Can parse thread comments up to 4x faster without parsing content.
		// Example: when parsing content — 650 ms, when not parsing content — 200 ms.
		parseContent: false,
		commentLengthLimit: configuration.commentLengthLimit
	})
	// Generate text preview which is used for `<meta description/>` on the thread page.
	generateTextPreview(thread.comments[0], messages)
	console.log(`Thread parsed in ${(Date.now() - startedAt) / 1000} secs`)
	// // Move thread title from the first comment to the thread object.
	// const title = thread.comments[0].title
	// if (title) {
	// 	thread.comments[0].title = undefined
	// }
	setThreadInfo(thread, 'comment')
	return {
		boardId,
		thread: {
			...thread,
			// title
		}
	}
}

/**
 * Generates a text preview of a comment.
 * Text preview is used for `<meta description/>`.
 * @param {object} comment
 * @return {string} [preview]
 */
function generateTextPreview(comment, messages) {
	const textPreview = getPostText(
		comment.content,
		comment.attachments,
		{
			ignoreAttachments: true,
			softLimit: 150,
			messages: messages.contentTypes
		}
	)
	if (textPreview) {
		comment.textPreview = trimText(textPreview, 150)
	}
}