import unescapeContent from '../../../utility/unescapeContent'

/**
 * Parses response board JSON object.
 * @param  {object} board — Response board JSON object.
 * @return {object} See README.md for "Board" object description.
 */
export default function parseBoard(board) {
	const parsedBoard = {
		id: board.board,
		title: board.title,
		description: unescapeContent(board.meta_description),
		category: getBoardCategory(board.board),
		bumpLimit: board.bump_limit,
		maxAttachmentsInThread: board.image_limit
	}
	if (board.ws_board === 0) {
		parsedBoard.isNotSafeForWork = true
	}
	// Presumably "is archived" means that 4chan archives threads on these boards
	// which means that when threads on those boards go down they're saved in the archive
	// and can be accessed.
	if (board.is_archived) {
		parsedBoard.isArchived = true
	}
	// `4chan.org` sometimes allows "TeX" (like "LaTeX") syntax for writing Math formulae.
	// https://b060e7a4-a-62cb3a1a-s-sites.googlegroups.com/site/scienceandmathguide/other/-sci-infographics/joseflatex.png?attachauth=ANoY7crDHFoNwHMiP0AS_eGBJo71fzfPs5KsVxxgPSfBrmswoaTPsnWHqwjKIzP4HDIrfv_-Io17zld0RAtcZOTIPTynm2om4nAd83WOpg6IT3WqCdrAEjqqrWwooCDgYrHWcTRxEM6myhEsGT46K30hInFQDZS17fz44X87VjfvKZQrwWLYIa7h1NU_7VZD3gBbuSZXLa8q4vMdBZfd_r2S1UlPwjVjpSoKRvV0PzuzHrshkjhVE9ko2Ap9T7rviyuSRJO3NGaQ&attredirects=0
	// Example: `/sci/` board.
	// The output on `4chan.org` is done using `jsMath` library which is deprecated since 2010.
	// The successor for `jsMath` is `MathJax`.
	// "TeX" formulae can be converted to "MathML" which is part of HTML5 standard:
	// https://en.wikipedia.org/wiki/MathML
	// That means that "MathML" formulae can be shown in web browsers without any third party libraries.
	if (board.math_tags) {
		parsedBoard.usesMath = true
	}
	// "SJIS" (aka "Shift_JIS") are ascii images created using Japanese fonts.
	// Example: `/jp/` board.
	if (board.sjis_tags) {
		parsedBoard.usesShiftJISArt = true
	}
	// `<pre/>` tags are used on `/g/` board to post code samples (or configs).
	if (board.code_tags) {
		parsedBoard.usesCodeTags = true
	}
	// "oekaki" is a widget for drawing simple pictures for posting on an imageboard.
	if (board.oekaki) {
		parsedBoard.usesOekaki = true
	}
	parsedBoard.maxCommentLength = board.max_comment_chars
	parsedBoard.maxAttachmentsSize = board.max_filesize // Example: 4194304
	parsedBoard.maxVideoAttachmentsSize = board.max_webm_filesize // Example: 3145728
	parsedBoard.createThreadCooldown = board.cooldowns.threads
	parsedBoard.postCommentCooldown = board.cooldowns.replies
	parsedBoard.attachFileCooldown = board.cooldowns.images
	return parsedBoard
}

function getBoardCategory(boardId) {
	for (const category of Object.keys(BOARD_CATEGORIES)) {
		if (BOARD_CATEGORIES[category].includes(boardId)) {
			return category
		}
	}
	return 'Other'
}

const BOARD_CATEGORIES = {
	'Japanese Culture': ['a', 'c', 'w', 'm', 'cgl', 'cm', 'f', 'n', 'jp'],
	'Video Games': ['v', 'vg', 'vp', 'vr'],
	'Interests': ['co', 'g', 'tv', 'k', 'o', 'an', 'tg', 'sp', 'asp', 'sci', 'his', 'int', 'out', 'toy'],
	'Creative': ['i', 'po', 'p', 'ck', 'ic', 'wg', 'lit', 'mu', 'fa', '3', 'gd', 'diy', 'wsg', 'qst'],
	'Miscellaneous': ['b', 'r9k', 'pol', 'bant', 'soc', 's4s'],
	'Adult': ['s', 'hc', 'hm', 'h', 'e', 'u', 'd', 'y', 't', 'hr', 'gif', 'aco', 'r']
}