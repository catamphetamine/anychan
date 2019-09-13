import unescapeContent from '../../../utility/unescapeContent'
import stringToColor from '../../../utility/stringToColor'

import parseAuthorRoleKohlChan from './parseAuthorRole.kohlchan'
import parseAuthor from './parseAuthor'
import parseAttachments from './parseAttachments'

/**
 * Parses response comment JSON object.
 * @param  {object} comment — Response comment JSON object.
 * @param  {object} options
 * @return {object} See README.md for "Comment" object description.
 */
export default function parseComment(post, {
	chan,
	boardId,
	threadId,
	attachmentUrl,
	attachmentThumbnailUrl,
	thumbnailSize,
	toAbsoluteUrl,
	defaultAuthorName
}) {
	// `post.markdown` is not really "markdown", it's HTML.
	// `lynxchan` has a bug of inserting "carriage return" (U+000D)
	// characters before every "new line" (<br>).
	// This workaround fixes that:
	const content = post.markdown.replace(/\u000d/g, '')
	const parsedAuthorRole = parseAuthorRole(post.signedRole, chan)
	const comment = {
		boardId,
		threadId,
		// `threadId` is present in "get threads list" API response
		// and at the root level (the "opening comment") of "get thread comments" API response.
		// `postId` is present in "get thread comments" API response
		// for all comments except the "opening comment".
		id: post.threadId || post.postId,
		// `post.subject` is `null` when there's no comment subject.
		// `lynxchan` thread subject sometimes contains
		// escaped characters like "&quot;", "&lt;", "&gt;".
		title: post.subject && unescapeContent(post.subject),
		content,
		authorName: parseAuthor(post.name, { defaultAuthorName, boardId }),
		authorRole: parsedAuthorRole && (chan === 'kohlchan' ? parsedAuthorRole.role : parsedAuthorRole),
		authorBan: post.banMessage && true,
		authorBanReason: post.banMessage, // '(USER WAS BANNED FOR THIS POST)'
		attachments: parseAttachments(post, {
			chan,
			boardId,
			attachmentUrl,
			attachmentThumbnailUrl,
			thumbnailSize,
			toAbsoluteUrl
		}),
		// In `/catalog.json` API response there's no `creation` property which is a bug.
		// http://lynxhub.com/lynxchan/res/722.html#q984
		createdAt: post.creation ? new Date(post.creation) : undefined
	}
	if (post.email) {
		if (post.email === 'sage') {
			comment.isSage = true
		} else {
			comment.authorEmail = post.email
		}
	}
	// Imageboards identify their posters by a hash of their IP addresses on some boards.
	// For example, `/pol/` on `kohlchan.net`.
	// `kohlchan.net` examples: eeac31, 0501f9.
	if (post.id) {
		comment.authorId = post.id
		comment.authorIdColor = stringToColor(post.id)
	}
	// `4chan`-alike imageboards (`4chan.org`, `8ch.net`, `kohlchan.net`)
	// displays poster country flags.
	if (post.flag) {
		const flagId = parseKohlchanFlagId(post.flag)
		let country
		if (FLAG_ID_COUNTRY_CODE_REGEXP.test(flagId)) {
			country = flagId.toUpperCase()
		}
		if (country) {
			comment.authorCountry = country
		} else {
			// `post.flagCode` is `null` for "Onion" flag:
			// ```
			// flag: "/.static/flags/onion.png"
			// flagCode: null
			// flagName: "Onion"
			// ````
			// comment.authorBadgeId = flagId
			comment.authorBadgeUrl = post.flag
			comment.authorBadgeName = post.flagName
		}
	}
	return comment
}

function parseAuthorRole(role, chan) {
	switch (chan) {
		case 'kohlchan':
			return parseAuthorRoleKohlChan(role)
	}
}

// "/.static/flags/onion.png" ->  "onion".
// "/.static/flags/vsa/ca.png" -> "vsa/ca". (California)
const FLAG_ID_REGEXP = /^\/\.static\/flags\/(.+)\.png$/
function parseKohlchanFlagId(flag) {
	const match = flag.match(FLAG_ID_REGEXP)
	if (match) {
		return match[1]
	}
}

// "br".
const FLAG_ID_COUNTRY_CODE_REGEXP = /^([a-z]{2})$/