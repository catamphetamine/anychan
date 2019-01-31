import { getPostText } from 'webapp-frontend/src/utility/post'

import parseThread from './parseThread'
import filterComment from './filterComment'
import correctGrammar from './correctGrammar'
import setPostLinkUrls from './setPostLinkUrls'

/**
 * Parses chan API response for threads list.
 * @param  {object} response — Chan API response for threads list
 * @param  {object} [options] — Can contain `filters` for ignored words filters
 * @return {object}
 * @example
 * // Returns:
 * // {
 * //   board: {
 * //     id: 'vg',
 * //     name: 'Video Games',
 * //     description: 'Video Games discussions'
 * //   },
 * //   thread: {
 * //     id: '12345',
 * //     boardId: 'vg',
 * //     subject: 'Subject',
 * //     ... See `parseThread.js`,
 * //     comments: [{
 * //       ... See `parseComment.js`
 * //     }]
 * //   },
 * //   pagesCount: 7
 * // }
 * parseThreads(response)
 */
export default function parseThreads(response, options = {}) {
	const { filters } = options
	let hiddenThreadIds = []
	if (filters) {
		hiddenThreadIds = response.threads
			.filter(_ => !filterComment(_.posts[0].comment, filters))
			.map(_ => _.thread_num)
	}
	const threads = response.threads.map(_ => parseThread(_, {
		defaultAuthor: response.default_name,
		boardId: response.Board,
		correctGrammar
	}))
	for (const thread of threads) {
		// Generate comment preview text.
		thread.comments[0].text = getPostText(thread.comments[0])
		// Hide some threads.
		if (hiddenThreadIds.includes(thread.id)) {
			thread.comments[0].hidden = true
		}
		// Set comment links.
		setPostLinkUrls(thread.comments[0])
		// Correct grammar in thread subjects.
		thread.subject = thread.subject && correctGrammar(thread.subject)
	}
	return {
		board: {
			id: response.Board,
			name: response.BoardName,
			description: response.BoardInfo
		},
		threads,
		pagesCount: response.pages.length - 1
	}
}