import parseComment from './parseComment'
import correctGrammar from './correctGrammar'

import setInReplyToQuotes from '../setInReplyToQuotes'
import setPostLinkUrls from '../setPostLinkUrls'
import setReplies from '../setReplies'

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
	const comments = await Promise.all(thread.posts.map(_ => parseComment(_, {
		threadId: thread.posts[0].num,
		defaultAuthor: response.default_name,
		filters,
		correctGrammar,
		parseCommentTextPlugins,
		youTubeApiKey,
		messages
	})))
	const threadId = comments[0].id
	for (const comment of comments) {
		if (comment.subject) {
			comment.subject = correctGrammar(comment.subject)
		}
		setInReplyToQuotes(comment.content, comments, { threadId, messages })
		setPostLinkUrls(comment, { threadId, messages })
	}
	setReplies(comments)
	// console.log(`Posts parsed in ${(Date.now() - startedAt) / 1000} secs`)
	// Return result.
	return comments
}