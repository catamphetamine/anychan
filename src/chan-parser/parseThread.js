import parseComment from './parseComment'

/**
 * Parses 2ch.hk thread JSON object.
 * @param  {object} thread — 2ch.hk thread JSON object.
 * @param  {object} options — `{ defaultAuthor, boardId, correctGrammar }`.
 * @return {object}
 * @example
 * // Outputs:
 * // {
 * //   id: '12345',
 * //   boardId: 'b',
 * //   author: 'Школьник',
 * //   isClosed: false,
 * //   isEndless: false, // "endless" threads don't disappear.
 * //   isSticky: false,
 * //   comments: [{
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
export default function parseThread(thread, options) {
	const { boardId } = options
	const _post = thread.posts[0]
	const comment = parseComment(_post, options)
	comment.commentsCount = thread.posts_count
	return {
		id: comment.id,
		boardId,
		isClosed: _post.closed === 1,
		isEndless: _post.endless === 1,
		isSticky: _post.sticky === 1,
		comments: [
			comment
		]
	}
}