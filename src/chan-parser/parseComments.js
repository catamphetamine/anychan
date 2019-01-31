import parseComment from './parseComment'
import filterComment from './filterComment'
import correctGrammar from './correctGrammar'
import setInReplyToQuotes from './setInReplyToQuotes'
import setPostLinkUrls from './setPostLinkUrls'
import setReplies from './setReplies'

/**
 * Parses chan API response for thread comments list.
 * @param  {object} response — Chan API response for thread comments list
 * @param  {object} [options] — Can contain `filters` for ignored words filters
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
 * //     subject: 'Subject',
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
export default function parseComments(response, options = {}) {
	const { filters } = options
	const thread = response.threads[0]
	// const startedAt = Date.now()
	let hiddenCommentIds = []
	if (filters) {
		hiddenCommentIds = thread.posts
			.filter(_ => !filterComment(_.comment, filters))
			.map(_ => String(_.num))
	}
	const comments = thread.posts.map(_ => parseComment(_, {
		defaultAuthor: response.default_name,
		correctGrammar
	}))
	const threadId = comments[0].id
	for (const comment of comments) {
		if (hiddenCommentIds.includes(comment.id)) {
			comment.hidden = true
		}
		comment.subject = comment.subject && correctGrammar(comment.subject)
		setInReplyToQuotes(comment.content, comments, threadId)
		setPostLinkUrls(comment, threadId)
	}
	setReplies(comments)
	// console.log(`Posts parsed in ${(Date.now() - startedAt) / 1000} secs`)
	// Return result.
	return {
		board: {
			id: response.Board,
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