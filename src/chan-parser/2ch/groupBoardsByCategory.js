/**
 * Groups boards into categories.
 * @param  {object[]} boards — parsed boards.
 * @return {object}
 * @example
 * // Outputs: `{ 'Аниме': [..., ...], 'Политика': [..., ...] }`.
 * groupBoardsByCategory([..., ...])
 */
export default function groupBoardsByCategory(boards) {
	return boards.reduce((categories, board) => {
		let category = categories.filter(_ => _.category === board.category)[0]
		if (!category) {
			category = {
				category: board.category,
				boards: []
			}
			categories.push(category)
		}
		category.boards.push({
			id: board.id,
			name: board.name,
			info: board.info,
			speed: board.speed
		})
		return categories
	}, [])
}