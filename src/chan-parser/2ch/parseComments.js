import parseComment from './parseComment'

import postProcessComments from '../postProcessComments'

/**
 * Parses chan API response for thread comments list.
 * @param  {object} response — Chan API response for thread comments list
 * @param  {object} options
 * @return {object}
 * @example
 * // Returns:
 * // [{
 * //   ... See `parseComment.js`
 * // }]
 * parseComments(response)
 */
export default function parseComments(response, {
	boardId,
	filters,
	messages,
	parseCommentPlugins
}) {
	const thread = response.threads[0]
	const threadId = thread.posts[0].num
	const comments = thread.posts.map(_ => parseComment(_, {
		boardId,
		threadId,
		defaultAuthor: response.default_name,
		filters,
		parseCommentPlugins,
		messages
	}))
	postProcessComments(comments, { threadId, messages })
	return comments
}