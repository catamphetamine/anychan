import getPostText from 'webapp-frontend/src/utility/getPostText'

import parseThread from './parseThread'
import correctGrammar from './correctGrammar'

import setPostLinkUrls from '../setPostLinkUrls'
import compileFilters from '../compileFilters'

/**
 * Parses chan API response for threads list.
 * @param  {object} response — Chan API response for threads list
 * @param  {object} [options] — `{ filters, getAttachmentUrl }`
 * @return {object}
 * @example
 * // Returns:
 * // {
 * //   board: {
 * //     id: 'vg',
 * //     name: 'Video Games',
 * //     description: 'Video Games discussions'
 * //   },
 * //   threads: [{
 * //     id: '12345',
 * //     boardId: 'vg',
 * //     ... See `parseThread.js`,
 * //     comments: [{
 * //       ... See `parseComment.js`
 * //     }]
 * //   }, ...]
 * // }
 * parseThreads(response)
 */
export default function parseThreads(response, {
	filters,
	getAttachmentUrl,
	messages,
	parseCommentTextPlugins
}) {
	const threads = response.threads.map(_ => parseThread(_, {
		defaultAuthor: response.default_name,
		boardId: response.Board,
		filters: filters ? compileFilters(filters) : undefined,
		correctGrammar,
		getAttachmentUrl,
		parseCommentTextPlugins
	}))
	for (const thread of threads) {
		// Generate comment preview text.
		thread.comments[0].text = getPostText(thread.comments[0])
		// Set comment links.
		setPostLinkUrls(thread.comments[0], thread.comments[0].num, { messages })
		// Correct grammar in thread subjects.
		thread.subject = thread.subject && correctGrammar(thread.subject)
	}
	return {
		board: {
			id: response.Board,
			name: response.BoardName,
			description: response.BoardInfo
		},
		threads
	}
}