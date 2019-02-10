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
export default async function parseBoards(response) {
	const boards = response.boards.map(parseBoard)
	return {
		boards,
		// `boards` are already sorted by `commentsPerHour`.
		boardsByPopularity: boards,
		boardsByCategory: groupBoardsByCategory(boards, [
			'Тематика',
			'Творчество',
			'Политика и новости',
			'Техника и софт',
			'Игры',
			'Японская культура',
			'Разное',
			'Взрослым'
		])
	}
}