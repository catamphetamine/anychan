import parseComment from './parseComment'

import setInReplyToQuotes from '../setInReplyToQuotes'
import setPostLinkUrls from '../setPostLinkUrls'
import setReplies from '../setReplies'
import compileFilters from '../compileFilters'

/**
 * Parses chan API response for thread comments list.
 * @param  {object} response — Chan API response for thread comments list
 * @param  {object} [options] — `{ filters, getAttachmentUrl }`
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
	boardId,
	getAttachmentUrl,
	messages,
	parseCommentTextPlugins,
	youTubeApiKey
}) {
	const comments = await Promise.all(response.posts.map(_ => parseComment(_, {
		boardId,
		threadId: response.posts[0].no,
		filters: filters ? compileFilters(filters) : undefined,
		getAttachmentUrl,
		parseCommentTextPlugins,
		youTubeApiKey
	})))
	const threadId = comments[0].id
	for (const comment of comments) {
		setInReplyToQuotes(comment.content, comments, { threadId, messages })
		setPostLinkUrls(comment, { boardId, threadId, messages })
	}
	setReplies(comments)
	// console.log(`Posts parsed in ${(Date.now() - startedAt) / 1000} secs`)
	// Return result.
	return comments
}