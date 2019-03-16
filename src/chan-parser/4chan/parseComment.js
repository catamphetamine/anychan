import parseAuthor from './parseAuthor'
import parseAttachment from './parseAttachment'
import getInReplyToPosts from './getInReplyToPosts'

import constructComment from '../constructComment'

const USER_BANNED_MARK = /<br><br><b style="color:red;">\(USER WAS BANNED FOR THIS POST\)<\/b>$/

/**
 * Parses response comment JSON object.
 * @param  {object} comment — Response comment JSON object.
 * @param  {object} options
 * @return {object} See README.md for "Comment" object description.
 */
export default function parseComment(post, {
	chan,
	boardId,
	filters,
	parseCommentPlugins,
	commentLengthLimit,
	messages,
	getUrl,
	commentUrlRegExp,
	attachmentUrl,
	attachmentThumbnailUrl,
	// `8ch.net` has `fpath: 0/1` parameter.
	attachmentUrlFpath,
	attachmentThumbnailUrlFpath,
	fileAttachmentUrl,
	defaultAuthorName
}) {
	let rawComment = post.com
	let authorWasBanned = false
	// `post.com` is absent when there's no text.
	if (rawComment) {
		// `<wbr>` is a legacy HTML tag for explicitly defined "line breaks".
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr
		rawComment = rawComment.replace(/<wbr>/g, '\u200b')
		// `8ch.net` adds `<em>:</em>` to links for some weird reason.
		rawComment = rawComment.replace(/(https?|ftp)<em>:<\/em>/g, '$1:')
		// Test if the author was banned for this post.
		if (USER_BANNED_MARK.test(rawComment)) {
			authorWasBanned = true
			rawComment = rawComment.replace(USER_BANNED_MARK, '')
		}
	}
	const comment = constructComment(
		boardId,
		post.resto, // `threadId`.
		post.no,
		rawComment,
		parseAuthor(post.name, { defaultAuthorName }),
		parseRole(post.capcode),
		authorWasBanned,
		// `post.sub` is absent when there's no comment subject.
		post.sub,
		parseAttachments(post, {
			chan,
			boardId,
			attachmentUrl,
			attachmentThumbnailUrl,
			// `8ch.net` has `fpath: 0/1` parameter.
			attachmentUrlFpath,
			attachmentThumbnailUrlFpath,
			fileAttachmentUrl
		}),
		post.time,
		{
			filters,
			parseCommentPlugins,
			getInReplyToPosts,
			commentLengthLimit,
			messages,
			getUrl,
			commentUrlRegExp
		}
	)
	// `8ch.net` identifies posters by 3 of 4 bytes of their
	// IP addresses on some boards. Example: `"id": "2e20aa"`.
	if (post.id) {
		comment.authorId = post.id
	}
	if (post.trip) {
		comment.tripCode = post.trip
	}
	return comment
}

// https://www.4chan.org/faq#capcode
// A capcode is a way of verifying someone as a 4chan team member.
// Normal users do not have the ability to post using a capcode.
// Janitors do not receive a capcode.
function parseRole(capCode) {
	switch (capCode) {
		case 'admin':
		case 'founder':
		case 'developer':
			return 'administrator'
		case 'mod':
		case 'manager':
			return 'moderator'
		default:
			if (capCode) {
				console.error(`Unsupported "capcode": ${capCode}`)
			}
	}
}

function parseAttachments(post, options) {
	let files = []
	if (post.ext) {
		files.push(post)
	}
	// `kohlchan.net` and `8ch.net` have "extra_files".
	if (post.extra_files) {
		files = files.concat(post.extra_files)
	}
	return files.filter(file => {
		// `8ch.net` seems to use `"ext": "deleted"` instead of `"filedeleted": 1`.
		if (file.ext === 'deleted') {
			return false
		}
		// // `4chan.org` and `kohlchan.net` use `"filedeleted": 0/1`.
		// // In case of `"filedeleted": 1` it seems that all file-related
		// // properties are also removed from the comment, so no need to filter.
		// if (file.filedeleted === 1) {
		// 	return false
		// }
		return true
	})
	.map(file => parseAttachment(file, options))
}