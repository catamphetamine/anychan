import parseAuthor from './parseAuthor'
import parseAttachment from './parseAttachment'
import getInReplyToPosts from './getInReplyToPosts'

import expandStandaloneAttachmentLinks from '../expandStandaloneAttachmentLinks'
import removeNewLineCharacters from '../removeNewLineCharacters'
import parseLinks from '../parseLinks'
import parseYouTubeLinks from '../parseYouTubeLinks'
import parseCommentText from '../parseCommentText'
import unescapeContent from '../unescapeContent'
import filterComment from '../filterComment'

/**
 * Parses response thread JSON object.
 * @param  {object} thread — Response thread JSON object.
 * @param  {object} options — `{ correctGrammar, filters, defaultAuthor, boardId }`
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
	defaultAuthor,
	parseCommentTextPlugins,
	youTubeApiKey,
	messages
}) {
	const id = post.no
	const author = parseAuthor(post.name)
	const comment = {
		id,
		inReplyTo: post.com ? getInReplyToPosts(post.com, { threadId }) : [],
		attachments: post.ext ? [parseAttachment(post, { boardId })] : [],
		createdAt: new Date(post.time * 1000)
	}
	if (post.sub) {
		comment.subject = unescapeContent(post.sub)
	}
	if (post.com) {
		// For some weird reason there occasionally are random `<wbr>` tags.
		const html = post.com.replace(/<wbr>/g, '')
		comment.content = parseCommentText(html, {
			parseParagraphs: false,
			parseCommentTextPlugins
		})
	}
	if (filters) {
		const reason = filterComment(post.comment, filters)
		if (reason) {
			comment.hidden = true
			comment.hiddenReason = reason
		}
	}
	if (author) {
		comment.author = author
	}
	parseLinks(comment)
	removeNewLineCharacters(comment)
	await parseYouTubeLinks(comment, { youTubeApiKey, messages })
	// This should be the last one in the chain of comment transformations
	// because it splits text into paragraphs.
	expandStandaloneAttachmentLinks(comment)
	return comment
}