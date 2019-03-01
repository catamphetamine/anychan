import parseAuthor from './parseAuthor'
import parseSubjectFromComment from './parseSubjectFromComment'
import parseAttachment from './parseAttachment'
import getInReplyToPosts from './getInReplyToPosts'
import correctGrammar from './correctGrammar'

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
export default function parseComment(post, {
	boardId,
	threadId,
	defaultAuthor,
	filters,
	parseCommentPlugins,
	messages
}) {
	let subject = post.subject
	// `post.comment` is always present, even when there's no text.
	let rawComment = post.comment
	// Detect `subject` being autogenerated from `comment`.
	// (for example, on `/b/` and `/rf/` boards)
	// If the `subject` is autogenerated then ignore it.
	if (subject && parseInt(post.num) === threadId) {
		if (isAutogeneratedSubject(subject, rawComment)) {
			subject = undefined
		}
	}
	// Sometimes there're some weird `\t` tabulation characters.
	// I guess they're of the same nature as `\r\n`s.
	rawComment = rawComment.replace(/\\t/g, '')
	const comment = constructComment(
		undefined, // boardId
		threadId,
		parseInt(post.num),
		rawComment,
		parseAuthor(post.name, defaultAuthor),
		subject,
		post.files.map(parseAttachment),
		post.timestamp,
		{
			filters,
			parseCommentPlugins,
			getInReplyToPosts,
			correctGrammar,
			messages
		}
	)
	const authorRole = getAuthorRole(post.trip)
	if (authorRole) {
		comment.authorRole = authorRole
	}
	return comment
}

function getAuthorRole(trip) {
	switch (trip) {
		case '!!%adm%!!':
			return 'administrator'
		case '!!%mod%!!':
			return 'moderator'
	}
}

/**
 * This is a reverse-engineered guess of
 * 2ch.hk's subject autogeneration algorithm.
 * @param  {string}  subject
 * @param  {string}  comment
 * @return {Boolean}
 */
function isAutogeneratedSubject(subject, comment) {
	const commentText = comment.replace(/<br>/g, ' ').replace(/<.+?>/g, '')
	return commentText.indexOf(subject) === 0
}