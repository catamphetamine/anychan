import unescapeContent from 'webapp-frontend/src/utility/unescapeContent'

/**
 * Parses response board JSON object
 * @param  {object} board — Response board JSON object
 * @return {object}
 * @example
 * // Outputs:
 * // {
 * //   id: '/a',
 * //   name: 'Anime thread',
 * //   description: 'Anime discussions',
 * //   category: 'Japanese Culture'
 * // }
 * parseBoard(...)
 */
export default function parseBoard(board) {
	return {
		id: board.board,
		name: board.title,
		description: unescapeContent(board.meta_description),
		category: getBoardCategory(board.board)
	}
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