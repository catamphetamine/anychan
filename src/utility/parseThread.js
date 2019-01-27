import { parsePost } from './parsePost'

/**
 * Parses 2ch.hk thread JSON object.
 * @param  {object} thread — 2ch.hk thread JSON object.
 * @param  {object} response — 2ch.hk threads API JSON response (contains `default_name` and `Board`).
 * @return {object}
 * @example
 * // Outputs:
 * // {
 * //   id: '12345',
 * //   board: 'b',
 * //   author: 'Школьник',
 * //   subject: 'В этом треде аниме',
 * //   isClosed: false,
 * //   isEndless: false, // "endless" threads don't disappear.
 * //   isSticky: false,
 * //   posts: [{
 * //     commentsCount: 18,
 * //     id: '45678',
 * //     author: 'Школьник №2',
 * //     content: ...,
 * //     inReplyTo: [{
 * //       threadId: '12345',
 * //       postId: '45677'
 * //     }],
 * //     createdAt: ...,
 * //     attachments: [{
 * //       id: 1,
 * //       type: 'picture',
 * //       size: 35.5, // in kilobytes
 * //       picture: {
 * //         type: 'image/jpeg',
 * //         sizes: [{
 * //           width: 120,
 * //           height: 40,
 * //           url: 'https://...'
 * //         }, {
 * //           width: 1200,
 * //           height: 400,
 * //           url: 'https://...'
 * //         }]
 * //       }
 * //     }, {
 * //       id: 2,
 * //       type: 'video',
 * //       size: 5260.12, // in kilobytes
 * //       video: {
 * //         type: 'video/webm',
 * //         duration: 50, // in seconds
 * //         width: 800,
 * //         height: 600,
 * //         source: {
 * //           provider: 'file',
 * //           sizes: [{
 * //             width: 800,
 * //             height: 600,
 * //             url: 'https://...'
 * //           }]
 * //         },
 * //         picture: {
 * //           type: 'image/jpeg',
 * //           sizes: [{
 * //             width: 800,
 * //             height: 600,
 * //             url: 'https://...'
 * //           }]
 * //         }
 * //       }
 * //     }]
 * //   }
 * // }]
 * parseThread(...)
 */
export default function parseThread_(thread, response, options = {}) {
	options.defaultAuthor = response.default_name
	options.boardId = response.Board
	return parseThread(thread, options)
}

function parseThread(thread, options) {
	const { correctGrammar, defaultAuthor, boardId } = options
	const _post = thread.posts[0]
	const post = parsePost(_post, options)
	post.commentsCount = thread.posts_count
	return {
		id: post.id,
		board: boardId,
		isClosed: _post.closed === 1,
		isEndless: _post.endless === 1,
		isSticky: _post.sticky === 1,
		posts: [
			post
		]
	}
}