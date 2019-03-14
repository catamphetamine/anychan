import parseBoard from './parseBoard'
import groupBoardsByCategory from '../groupBoardsByCategory'

/**
 * Parses chan API response for boards list.
 * @param  {object} response — Chan API response for boards list.
 * @return {object[]} See README.md for "Board" object description.
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