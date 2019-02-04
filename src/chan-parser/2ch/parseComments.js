import parseComment from './parseComment'
import correctGrammar from './correctGrammar'

import setInReplyToQuotes from '../setInReplyToQuotes'
import setPostLinkUrls from '../setPostLinkUrls'
import setReplies from '../setReplies'
import compileFilters from '../compileFilters'

/**
 * Parses chan API response for thread comments list.
 * @param  {object} response — Chan API response for thread comments list
 * @param  {object} [options] — `{ filters }`
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
	const comments = await Promise.all(thread.posts.map(_ => parseComment(_, {
		threadId: thread.posts[0].num,
		defaultAuthor: response.default_name,
		filters: filters ? compileFilters(filters) : undefined,
		correctGrammar,
		parseCommentTextPlugins,
		youTubeApiKey
	})))
	const threadId = comments[0].id
	for (const comment of comments) {
		if (comment.subject) {
			comment.subject = correctGrammar(comment.subject)
		}
		setInReplyToQuotes(comment.content, comments, threadId)
		setPostLinkUrls(comment, { threadId, messages })
	}
	setReplies(comments)
	// console.log(`Posts parsed in ${(Date.now() - startedAt) / 1000} secs`)
	// Return result.
	return comments
}