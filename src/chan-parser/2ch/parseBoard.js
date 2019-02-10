/**
 * Parses response board JSON object
 * @param  {object} board — Response board JSON object
 * @return {object}
 * @example
 * // Outputs:
 * // {
 * //   category: 'Аниме',
 * //   id: '/a',
 * //   name: 'Аниме тред',
 * //   description: 'Обсуждение аниме',
 * //   commentsPerHour: 11.5
 * // }
 * parseBoard(...)
 */
export default function parseBoard(board) {
	return {
		id: board.id,
		name: board.name,
		description: board.info,
		category: board.category,
		commentsPerHour: board.speed
	}
}