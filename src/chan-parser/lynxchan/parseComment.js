import unescapeContent from 'webapp-frontend/src/utility/unescapeContent'
import stringToColor from 'webapp-frontend/src/utility/stringToColor'

import parseAuthorRoleKohlChan from './parseAuthorRole.kohlchan'
import parseAuthor from './parseAuthor'
import parseAttachment, { getPictureTypeFromUrl as getPictureTypeFromUrlKohlChan } from './parseAttachment'

import constructComment from '../constructComment'

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
	filters,
	parseCommentPlugins,
	commentLengthLimit,
	messages,
	getUrl,
	commentUrlRegExp,
	emojiUrl,
	attachmentUrl,
	attachmentThumbnailUrl,
	thumbnailSize,
	defaultAuthorName,
	parseContent,
	parseContentForOpeningPost
}) {
	// `lynxchan` has a bug of inserting "carriage return" (U+000D)
	// characters before every "new line" (<br>).
	// This workaround fixes that:
	const rawComment = post.markdown.replace(/\u000d/g, '')
	const parsedAuthorRole = parseAuthorRole(post.signedRole, chan)
	const comment = constructComment(
		boardId,
		threadId,
		post.threadId || post.postId,
		rawComment,
		parseAuthor(post.name, { defaultAuthorName, boardId }),
		parsedAuthorRole && (chan === 'kohlchan' ? parsedAuthorRole.role : parsedAuthorRole),
		post.banMessage, // '(USER WAS BANNED FOR THIS POST)'
		// `post.sub` is absent when there's no comment subject.
		// On `4chan.org` and `8ch.net` thread subject sometimes contains
		// escaped characters like "&quot;", "&lt;", "&gt;".
		post.subject,
		// In `/catalog.json` API response there're no `files`, only `thumb` property, which is a bug.
		// http://lynxhub.com/lynxchan/res/722.html#q984
		(post.files || [{
			// A stub for the absent `files` bug in `/catalog.json` API response.
			// http://lynxhub.com/lynxchan/res/722.html#q984
			mime: getPictureTypeFromUrl(post.thumb, chan),
			// `lynxchan` doesn't provide `width` and `height`
			// neither for the picture not for the thumbnail
			// in `/catalog.json` API response (which is a bug).
			// http://lynxhub.com/lynxchan/res/722.html#q984
			// `width` and `height` are set later when the image is loaded.
			width: 0,
			height: 0,
			// Even if `path` URL would be derived from `thumb` URL
			// the `width` and `height` would still be unspecified.
			// path: getFileUrlFromThumbnailUrl(post.thumb, chan),
			path: post.thumb,
			thumb: post.thumb,
			originalName: '[stub]'
		}]).map(file => parseAttachment(file, {
			chan,
			boardId,
			attachmentUrl,
			attachmentThumbnailUrl,
			thumbnailSize
		})),
		// In `/catalog.json` API response there's no `creation` property which is a bug.
		// http://lynxhub.com/lynxchan/res/722.html#q984
		new Date(post.creation || 0),
		{
			filters,
			parseCommentPlugins,
			commentLengthLimit,
			messages,
			getUrl,
			emojiUrl,
			commentUrlRegExp,
			parseContent,
			parseContentForOpeningPost,
			emojiUrl
		}
	)
	if (post.email) {
		comment.authorEmail = post.email
	}
	// Imageboards identify their posters by a hash of their IP addresses on some boards.
	// For example, `/pol/` on `kohlchan.net`.
	// `kohlchan.net` examples: eeac31, 0501f9.
	if (post.id) {
		comment.authorId = post.id
		comment.authorIdColor = stringToColor(post.id)
	}
	if (post.forceAnonymity) {
		// `forceAnonymity: true` disables author names in a thread:
		// forces empty/default `name` on all posts of a thread.
	}
	if (post.email) {
		if (post.email === 'sage') {
			comment.isSage = true
		}
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
			comment.authorIconId = flagId
			comment.authorIconName = post.flagName
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
const FLAG_ID_REGEXP = /^\/\.static\/flags\/([^/]+)\.png$/
function parseKohlchanFlagId(flag) {
	const match = flag.match(FLAG_ID_REGEXP)
	if (match) {
		return match[1]
	}
}

// "br".
const FLAG_ID_COUNTRY_CODE_REGEXP = /^([a-z]{2})$/

// function getFileUrlFromThumbnailUrl(thumbnailUrl, chan) {
// 	switch (chan) {
// 		case 'kohlchan':
// 			return thumbnailUrl.replace('/.media/t_', '/.media/')
// 		default:
// 			return thumbnailUrl
// 	}
// }

function getPictureTypeFromUrl(url, chan) {
	switch (chan) {
		case 'kohlchan':
			return getPictureTypeFromUrlKohlChan(url)
		default:
			return 'image/jpeg'
	}
}