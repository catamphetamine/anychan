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
 * //     id: 'v',
 * //     name: 'Video Games General',
 * //     description: 'Video Games general discussions',
 * //     category: 'Video Games'
 * //   }, ...],
 * //   boardsByCategory: {
 * //     'Video Games': [{
 * //       id: 'v',
 * //       name: 'Video Games General',
 * //       description: 'Video Games general discussions'
 * //     }, ...]
 * //   }
 * // }
 * parseBoards(response)
 */
export default function parseBoards(response) {
	const boards = response.boards.map(parseBoard)
		// Hide "user" boards.
		.filter(_ => _.category !== 'Пользовательские')
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