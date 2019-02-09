import parseThread from './parseThread'

/**
 * Parses chan API response for threads list.
 * @param  {object} response — Chan API response for threads list
 * @param  {object} options
 * @return {object}
 * @example
 * // Returns:
 * // [{
 * //   id: '12345',
 * //   ... See `parseThread.js`,
 * //   comments: [{
 * //     ... See `parseComment.js`
 * //   }]
 * // }, ...]
 * parseThreads(response)
 */
export default async function parseThreads(response, {
	boardId,
	filters,
	messages,
	parseCommentTextPlugins,
	youTubeApiKey
}) {
	const threads = response.reduce((all, page) => all.concat(page.threads), [])
	return await Promise.all(threads.map((thread) => parseThread(thread, {
		boardId,
		filters,
		parseCommentTextPlugins,
		youTubeApiKey,
		messages
	})))
}