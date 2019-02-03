import parseBoard from './parseBoard'
import groupBoardsByCategory from './groupBoardsByCategory'

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
 * //   }, ...],
 * //   boardsByCategory: {
 * //     'Игры': [{
 * //       id: 'vg',
 * //       name: 'Video Games',
 * //       description: 'Video Games discussions'
 * //     }, ...]
 * //   }
 * // }
 * parseBoards(response)
 */
export default function parseBoards(response) {
	const boards = response.boards.map(parseBoard)
	// `boards` are already sorted by posting "speed".
	// const boardsBySpeed = boards //.slice().sort((a, b) => b.speed - a.speed)
	const boardsByCategory = groupBoardsByCategory(boards)
	return {
		boards,
		boardsByCategory
	}
}