import unescapeContent from 'webapp-frontend/src/utility/unescapeContent'
import stringToColor from 'webapp-frontend/src/utility/stringToColor'

import parseAuthorRoleKohlChan from './parseAuthorRole.kohlchan'
import parseAuthor from './parseAuthor'
import parseAttachment from './parseAttachment'

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
	attachmentUrl,
	attachmentThumbnailUrl,
	defaultAuthorName,
	parseContent,
	parseContentForOpeningPost
}) {
	const rawComment = post.markdown
	const parsedAuthorRole = parseAuthorRole(post.signedRole, chan)
	const authorWasBanned = false
	const comment = constructComment(
		boardId,
		threadId,
		post.threadId || post.postId,
		rawComment,
		parseAuthor(post.name, { defaultAuthorName, boardId }),
		parsedAuthorRole,
		authorWasBanned,
		// `post.sub` is absent when there's no comment subject.
		// On `4chan.org` and `8ch.net` thread subject sometimes contains
		// escaped characters like "&quot;", "&lt;", "&gt;".
		post.subject,
		// In `/catalog.json` API response there're no `files`, only `thumb` property, which is a bug.
		(post.files || [{
			// A stub for the absent `files` bug in `/catalog.json` API response.
			mime: 'image/png',
			width: 200,
			height: 200,
			path: post.thumb,
			thumb: post.thumb,
			originalName: '[stub]'
		}]).map(file => parseAttachment(file, {
			chan,
			boardId,
			attachmentUrl,
			attachmentThumbnailUrl
		})),
		// In `/catalog.json` API response there's no `creation` property which is a bug.
		new Date(post.creation || 0),
		{
			filters,
			parseCommentPlugins,
			commentLengthLimit,
			messages,
			getUrl,
			commentUrlRegExp,
			parseContent,
			parseContentForOpeningPost
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
		// What does it mean.
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