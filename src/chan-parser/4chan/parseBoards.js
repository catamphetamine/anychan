import parseBoard from './parseBoard'
import groupBoardsByCategory from '../groupBoardsByCategory'

/**
 * Parses chan API response for boards list.
 * @param  {object} response — Chan API response for boards list
 * @return {object}
 * @example
 * // Returns:
 * // {
 * //   boards: [{
 * //     id: 'vg',
 * //     name: 'Video Games',
 * //     description: 'Video Games discussions'
 * //   }, ...]
 * // }
 * parseBoards(response)
 */
export default async function parseBoards(response) {
	const boards = response.boards.map(parseBoard)
	return {
		boards,
		boardsByCategory: groupBoardsByCategory(boards, [
			'Japanese Culture',
			'Video Games',
			'Interests',
			'Creative',
			'Other',
			'Miscellaneous',
			'Adult'
		])
	}
}