import unescapeContent from 'webapp-frontend/src/utility/unescapeContent'

/**
 * Parses response board JSON object.
 * @param  {object} board — Response board JSON object.
 * @return {object} See README.md for "Board" object description.
 */
export default function parseBoard(board) {
	const parsedBoard = {
		id: board.board,
		name: board.title,
		description: unescapeContent(board.meta_description),
		category: getBoardCategory(board.board),
		bumpLimit: board.bump_limit,
		attachmentLimit: board.image_limit
	}
	if (board.ws_board === 0) {
		parsedBoard.isNotSafeForWork = true
	}
	parsedBoard.maxCommentLength = board.max_comment_chars
	parsedBoard.maxAttachmentsSize = board.max_filesize // Example: 4194304
	parsedBoard.maxVideoAttachmentsSize = board.max_webm_filesize // Example: 3145728
	parsedBoard.createThreadCooldown = board.cooldowns.threads
	parsedBoard.replyCooldown = board.cooldowns.replies
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