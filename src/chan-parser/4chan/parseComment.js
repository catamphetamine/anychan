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
	// `8ch.net` identifies posters by 3 of 4 bytes of their IP address.
	// Example: `"id": "2e20aa"`.
	if (post.id) {
		comment.authorId
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
	// kohlchan.net has "extra_files".
	if (post.extra_files) {
		files = files.concat(post.extra_files)
	}
	return files.map(file => parseAttachment(file, options))
}