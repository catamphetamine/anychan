import parseThread from './parseThread'
import correctGrammar from './correctGrammar'

import setPostLinkUrls from '../setPostLinkUrls'

/**
 * Parses chan API response for threads list.
 * @param  {object} response — Chan API response for threads list
 * @param  {object} options
 * @return {object}
 * @example
 * // Returns:
 * // [{
 * //   id: 12345,
 * //   ... See `parseThread.js`,
 * //   comments: [{
 * //     ... See `parseComment.js`
 * //   }]
 * // }, ...]
 * parseThreads(response)
 */
export default async function parseThreads(response, {
	filters,
	messages,
	parseCommentTextPlugins,
	youTubeApiKey
}) {
	const threads = await Promise.all(response.threads.map(_ => parseThread(_, {
		defaultAuthor: response.default_name,
		filters,
		correctGrammar,
		parseCommentTextPlugins,
		youTubeApiKey,
		messages
	})))
	for (const thread of threads) {
		// Set comment links.
		setPostLinkUrls(thread.comments[0], {
			threadId: thread.comments[0].id,
			messages
		})
		// Correct grammar in thread subjects.
		thread.subject = thread.subject && correctGrammar(thread.subject)
	}
	return threads
}