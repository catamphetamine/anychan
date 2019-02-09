import parseAuthor from './parseAuthor'
import parseAttachment from './parseAttachment'
import getInReplyToPosts from './getInReplyToPosts'

import constructComment from '../constructComment'

/**
 * Parses response thread JSON object.
 * @param  {object} thread — Response thread JSON object.
 * @param  {object} options
 * @return {object}
 * @example
 * // Outputs:
 * // {
 * //   id: 45678,
 * //   author: 'Школьник №2',
 * //   content: ...,
 * //   inReplyTo: [
 * //     45677
 * //   ],
 * //   createdAt: ...,
 * //   attachments: [{
 * //     type: 'picture',
 * //     size: 35.5, // in kilobytes
 * //     picture: {
 * //       type: 'image/jpeg',
 * //       sizes: [{
 * //         width: 120,
 * //         height: 40,
 * //         url: 'https://...'
 * //       }, {
 * //         width: 1200,
 * //         height: 400,
 * //         url: 'https://...'
 * //       }]
 * //     }
 * //   }, {
 * //     type: 'video',
 * //     size: 5260.12, // in kilobytes
 * //     video: {
 * //       type: 'video/webm',
 * //       duration: 50, // in seconds
 * //       width: 800,
 * //       height: 600,
 * //       source: {
 * //         provider: 'file',
 * //         sizes: [{
 * //           width: 800,
 * //           height: 600,
 * //           url: 'https://...'
 * //         }]
 * //       },
 * //       picture: {
 * //         type: 'image/jpeg',
 * //         sizes: [{
 * //           width: 800,
 * //           height: 600,
 * //           url: 'https://...'
 * //         }]
 * //       }
 * //     }
 * //   }]
 * // }
 * parseComment(...)
 */
export default async function parseComment(post, {
	boardId,
	threadId,
	filters,
	parseCommentTextPlugins,
	youTubeApiKey,
	messages
}) {
	let rawComment = post.com
	// `post.com` is absent when there's no text.
	if (rawComment) {
		// For some weird reason there occasionally are random `<wbr>` tags.
		rawComment = rawComment.replace(/<wbr>/g, '')
	}
	const comment = await constructComment(
		boardId,
		threadId,
		post.no,
		rawComment,
		parseAuthor(post.name),
		// `post.sub` is absent when there's no comment subject.
		post.sub,
		post.ext ? [parseAttachment(post, { boardId })] : [],
		post.time,
		{
			filters,
			parseCommentTextPlugins,
			getInReplyToPosts,
			youTubeApiKey,
			messages
		}
	)
	return comment
}