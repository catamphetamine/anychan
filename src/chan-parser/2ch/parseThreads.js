import parseThread from './parseThread'

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
export default function parseThreads(response, {
	boardId,
	filters,
	messages,
	parseCommentPlugins,
	commentLengthLimit
}) {
	return response.threads.map((thread) => parseThread(thread, {
		boardId,
		defaultAuthor: response.default_name,
		filters,
		parseCommentPlugins,
		commentLengthLimit,
		messages
	}))
}