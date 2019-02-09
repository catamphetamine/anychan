import parseThread from './parseThread'

import setPostLinkUrls from '../setPostLinkUrls'

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
	let threads = response.reduce((all, page) => all.concat(page.threads), [])
	threads = await Promise.all(threads.map(_ => parseThread(_, {
		boardId,
		filters,
		parseCommentTextPlugins,
		youTubeApiKey,
		messages
	})))
	for (const thread of threads) {
		// Set comment links.
		setPostLinkUrls(thread.comments[0], {
			boardId,
			threadId: thread.comments[0].id,
			messages
		})
	}
	return threads
}