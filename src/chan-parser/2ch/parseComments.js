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
export default async function parseComments(response, {
	filters,
	messages,
	parseCommentTextPlugins,
	youTubeApiKey
}) {
	const thread = response.threads[0]
	const threadId = thread.posts[0].num
	const comments = await Promise.all(thread.posts.map(_ => parseComment(_, {
		threadId,
		defaultAuthor: response.default_name,
		filters,
		parseCommentTextPlugins,
		youTubeApiKey,
		messages
	})))
	postProcessComments(comments, { threadId, messages })
	return comments
}