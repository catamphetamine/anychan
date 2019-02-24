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
	filters,
	boardId,
	messages,
	parseCommentTextPlugins
}) {
	const threadId = response.posts[0].no
	const comments = response.posts.map(_ => parseComment(_, {
		boardId,
		threadId,
		filters,
		parseCommentTextPlugins,
		messages
	}))
	postProcessComments(comments, { threadId, messages })
	return comments
}