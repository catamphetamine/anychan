import unescapeContent from '../unescapeContent'

/**
 * Parses response board JSON object
 * @param  {object} board — Response board JSON object
 * @return {object}
 * @example
 * // Outputs:
 * // {
 * //   id: '/a',
 * //   name: 'Anime thread',
 * //   description: 'Anime discussions'
 * // }
 * parseBoard(...)
 */
export default function parseBoard(board) {
	return {
		id: board.board,
		name: board.title,
		description: unescapeContent(board.meta_description)
	}
}