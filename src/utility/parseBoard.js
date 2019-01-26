/**
 * Parses 2ch.hk board JSON object
 * @param  {object} board — 2ch.hk board JSON object
 * @return {object}
 * @example
 * // Outputs:
 * // {
 * //   category: 'Аниме',
 * //   id: '/a',
 * //   name: 'Аниме тред',
 * //   description: 'Обсуждение аниме',
 * //   postsPerHour: 11.5
 * // }
 * parseBoard(...)
 */
export default function parseBoard(board) {
	return {
		category: board.category,
		id: board.id,
		name: board.name,
		description: board.info,
		postsPerHour: board.speed
	}
}