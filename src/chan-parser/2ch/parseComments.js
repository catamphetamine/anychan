import parseComment from './parseComment'
import correctGrammar from './correctGrammar'

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
 * // {
 * //   board: {
 * //     id: 'vg',
 * //     name: 'Video Games',
 * //     description: 'Video Games discussions'
 * //   },
 * //   thread: {
 * //     id: '12345',
 * //     boardId: 'vg',
 * //     ... See `parseThread.js`,
 * //     comments: [{
 * //       ... See `parseComment.js`
 * //     }]
 * //   },
 * //   comments: [{
 * //     ... See `parseComment.js`
 * //   }]
 * // }
 * parseComments(response)
 */
export default function parseComments(response, {
	filters,
	getAttachmentUrl,
	messages,
	parseCommentTextPlugins
}) {
	const boardId = response.Board
	const thread = response.threads[0]
	const comments = thread.posts.map(_ => parseComment(_, {
		boardId,
		threadId: thread.posts[0].num,
		defaultAuthor: response.default_name,
		filters: filters ? compileFilters(filters) : undefined,
		correctGrammar,
		getAttachmentUrl,
		parseCommentTextPlugins
	}))
	const threadId = comments[0].id
	for (const comment of comments) {
		if (comment.subject) {
			comment.subject = correctGrammar(comment.subject)
		}
		setInReplyToQuotes(comment.content, comments, threadId)
		setPostLinkUrls(comment, threadId, { messages })
	}
	setReplies(comments)
	// console.log(`Posts parsed in ${(Date.now() - startedAt) / 1000} secs`)
	// Return result.
	return {
		board: {
			id: boardId,
			name: response.BoardName,
			description: response.BoardInfo
		},
		thread: {
			id: comments[0].id,
			boardId: response.Board,
			comments: [comments[0]]
		},
		comments
	}
}