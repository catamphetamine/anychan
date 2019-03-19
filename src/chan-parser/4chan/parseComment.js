import parseAuthor from './parseAuthor'
import parseAttachment from './parseAttachment'

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
		// `4chan.org` inserts `<wbr>` in long URLs every 35 characters
		// presumably to prevent post text overflow.
		// I don't see any point in that because CSS can handle such things
		// using a combination of `overflow-wrap: break-word` and `word-break: break-word`
		// so all `<wbr>`s are simply discarded (otherwise they'd mess with hyperlink autodetection).
		// I could replace all `<wbr>`s with "\u200b"
		// (a "zero-width" space for indicating possible line break points)
		// but then hyperlink autodetection code would have to filter them out,
		// and as I already said above line-breaking long text is handled by CSS.
		rawComment = rawComment.replace(/<wbr>/g, '')
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
			commentLengthLimit,
			messages,
			getUrl,
			commentUrlRegExp
		}
	)
	// `4chan`-alike imageboards (`4chan.org`, `8ch.net`, `kohlchan.net`)
	// identify their posters by 3 or 4 of 4 bytes of their IP addresses on some boards.
	// For example, `/pol/` on `4chan.org`, `8ch.net`, `kohlchan.net`.
	// `8ch.net` and `kohlchan.net` example: `"id": "2e20aa"`.
	// `4chan.org` example: `"id": "Bg9BS7Xl"`.
	if (post.id) {
		comment.authorId = post.id
	}
	// `4chan`-alike imageboards (`4chan.org`, `8ch.net`, `kohlchan.net`)
	// displays poster country flags.
	if (post.country) {
		// `kohlchan.net` has incorrect country codes.
		// Examples: "UA", "RU-MOW", "TEXAS", "PROXYFAG".
		if (chan === 'kohlchan') {
			comment.authorCountryId = post.country.toLowerCase()
			comment.authorCountryName = post.country_name
		} else {
			// `8ch.net` and `4chan.org` have correct country codes.
			// Examples: "GB", "US", "RU".
			comment.authorCountry = post.country
			// `chanchan` has its own localized country names.
			// comment.authorCountryName = post.country_name
		}
	}
	if (post.trip) {
		comment.tripCode = post.trip
	}
	// `4chan.org` smaller copies of images (limited to 1024x1024) for mobile users.
	// These images are in the same location as usual but the filename ends with "m".
	// `m_img` parameter indicates that this smaller image is available.
	// https://github.com/4chan/4chan-API/issues/63
	// if (post.m_img) {
	// 	comment.mobileImageIsAvailable = true
	// }
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