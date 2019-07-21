/**
 * Groups boards into categories.
 * @param  {object[]} boards — parsed boards.
 * @param  {string[]} [categoriesOrder] — Defines the order of categories.
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
		// If the `category` isn't specified in the ordered list
		// then append it at the end.
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