import unescapeContent from '../../../utility/unescapeContent'
import stringToColor from '../../../utility/stringToColor'

import parseAuthor from './parseAuthor'
import parseAuthorRoleFourChan from './parseAuthorRole.4chan'
import parseAuthorRoleEightChan from './parseAuthorRole.8ch'
import parseAttachments from './parseAttachments'

const USER_BANNED_MARK = /<br><br><b style="color:red;">\(USER WAS BANNED FOR THIS POST\)<\/b>$/

// Actually, `lainchan` doesn't provide the "warnings" in JSON.
// const LAINCHAN_POST_WARNING_REGEXP = /<span class="public_warning">\((.+)\)<\/span>$/

/**
 * Parses response comment JSON object.
 * @param  {object} comment — Response comment JSON object.
 * @param  {object} options
 * @return {object} See README.md for "Comment" object description.
 */
export default function parseComment(post, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	// `8ch.net` has `fpath: 0/1` parameter.
	attachmentUrlFpath,
	attachmentThumbnailUrlFpath,
	fileAttachmentUrl,
	toAbsoluteUrl,
	defaultAuthorName
}) {
	let content = post.com
	let authorBan = false
	// `post.com` is absent when there's no text.
	if (content) {
		// I figured that 4chan places <wbr> ("line break") tags
		// when something not having spaces is longer than 35 characters.
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
		// Also `4chan.org` sometimes has `<wbr>` in weird places.
		// For example, given the equation "[math]f(x)=\\frac{x^3-x}{(x^2+1)^2}[<wbr>/math]"
		// `4chan.org` has inserted `<wbr>` after 35 characters of the whole equation markup
		// while in reality it either should not have inserted a `<wbr>` or should have inserted it
		// somewhere other place than the "[/math]" closing tag.
		// https://github.com/4chan/4chan-API/issues/66
		if (chan === '4chan') {
			content = content.replace(/<wbr>/g, '')
		}
		// `8ch.net` adds `<em>:</em>` to links for some weird reason.
		if (chan === '8ch') {
			content = content.replace(/(https?|ftp)<em>:<\/em>/g, '$1:')
		}
		// Test if the author was banned for this post.
		if (chan === '4chan') {
			if (USER_BANNED_MARK.test(content)) {
				authorBan = true
				content = content.replace(USER_BANNED_MARK, '')
			}
		}
		// // Actually, `lainchan` doesn't provide the "warnings" in JSON.
		// else if (chan === 'lainchan') {
		// 	const match = content.match(LAINCHAN_POST_WARNING_REGEXP)
		// 	if (match) {
		// 		// Maybe not really banned. Maybe just a "warning".
		// 		authorBan = match[0]
		// 		content = content.replace(LAINCHAN_POST_WARNING_REGEXP, '')
		// 	}
		// }
	}
	const parsedAuthorRole = parseAuthorRole(post, chan, { boardId })
	const comment = {
		boardId,
		// `resto` is `0` for the first post of the thread.
		threadId: post.resto || post.no,
		id: post.no,
		// `post.sub` is absent when there's no comment subject.
		// On `4chan.org` and `8ch.net` thread subject sometimes contains
		// escaped characters like "&quot;", "&lt;", "&gt;".
		title: post.sub && unescapeContent(post.sub),
		content,
		authorName: parseAuthor(post.name, { defaultAuthorName, boardId }),
		authorRole: parsedAuthorRole && (chan === '8ch' ? parsedAuthorRole.role : parsedAuthorRole),
		authorBan,
		attachments: parseAttachments(post, {
			chan,
			boardId,
			attachmentUrl,
			attachmentThumbnailUrl,
			// `8ch.net` has `fpath: 0/1` parameter.
			attachmentUrlFpath,
			attachmentThumbnailUrlFpath,
			fileAttachmentUrl,
			toAbsoluteUrl
		}),
		createdAt: new Date(post.time * 1000)
	}
	if (chan === '8ch' && parsedAuthorRole) {
		comment.authorRoleDomain = parsedAuthorRole.domain
	}
	// `8ch.net` and `kohlchan.net` (`vichan` engine) have `email` property.
	if (post.email) {
		// I guess those are mobile users with `<input type="text"/>` autocapitalization.
		if (post.email === 'sage' || post.email === 'Sage') {
			comment.isSage = true
		} else {
			comment.authorEmail = post.email
		}
	}
	// `4chan`-alike imageboards (`4chan.org`, `8ch.net`, `kohlchan.net`)
	// identify their posters by a hash of their IP addresses on some boards.
	// For example, `/pol/` on `4chan.org`, `8ch.net`, `kohlchan.net`.
	// `8ch.net` example: 2e20aa, d1e8f1, 000000.
	// `kohlchan.net` examples: a8d15, 90048, a26d4.
	// `4chan.org` examples: Bg9BS7Xl, rhGbaBg/, L/+PhYNf.
	if (post.id) {
		comment.authorId = post.id
		comment.authorIdColor = stringToColor(post.id)
	}
	// `4chan`-alike imageboards (`4chan.org`, `8ch.net`, `kohlchan.net`)
	// displays poster country flags.
	if (post.country) {
		// `8ch.net` and `4chan.org` have correct country codes.
		// Examples: "GB", "US", "RU".
		comment.authorCountry = post.country
		// `captchan` has its own localized country names.
		// comment.authorCountryName = post.country_name
	}
	if (post.trip) {
		comment.tripCode = post.trip
	}
	return comment
}

function parseAuthorRole(post, chan, { boardId }) {
	switch (chan) {
		case '4chan':
			return parseAuthorRoleFourChan(post.capcode)
		case '8ch':
			return parseAuthorRoleEightChan(post.capcode, { boardId })
	}
}