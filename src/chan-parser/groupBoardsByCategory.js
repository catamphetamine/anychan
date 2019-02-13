/**
 * Groups boards into categories.
 * @param  {object[]} boards — parsed boards.
 * @return {object}
 * @example
 * // Outputs:
 * // `[{
 * //   category: 'Аниме',
 * //   boards: [..., ...]
 * // }, {
 * //   category: 'Политика',
 * //   boards: [..., ...]
 * // }, ...]`.
 * groupBoardsByCategory([..., ...])
 */
export default function groupBoardsByCategory(boards, categoriesOrder = []) {
	const categories = []
	for (const category of categoriesOrder) {
		categories.push({
			category,
			boards: []
		})
	}
	return boards.reduce((categories, board) => {
		let category = categories.filter(_ => _.category === board.category)[0]
		if (!category) {
			category = {
				category: board.category,
				boards: []
			}
			categories.push(category)
		}
		category.boards.push(board)
		return categories
	}, categories).filter(_ => _.boards.length > 0)
}