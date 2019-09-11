import Chan from './Chan'
import { getChan } from '../chan'

export default async function getBoards({ http, all }) {
	// // Development process optimization: use a cached list of `2ch.hk` boards.
	// // (to aviod the delay caused by a CORS proxy)
	// if (process.env.NODE_ENV !== 'production' && getBoardsExample(getChan().id)) {
	// 	response = getBoardsExample(getChan().id)
	// }
	const chan = Chan({ http })
	const options = {
		hideBoardCategories: all ? undefined : getChan().hideBoardCategories
	}
	const boards = await (all ? chan.getAllBoards(options) : chan.getBoards(options))
	if (all) {
		return { allBoards: getBoardsResult(boards) }
	}
	return getBoardsResult(boards)
}

export function getBoardsExample(chan) {
	switch (chan) {
		case '2ch':
			return [{
				id: 'a',
				title: 'Аниме'
			}]
	}
}

export function getBoardsResult(boards) {
	const result = {
		boards
	}
	if (boards[0].commentsPerHour) {
		result.boardsByPopularity = boards.slice().sort((a, b) => b.commentsPerHour - a.commentsPerHour)
	}
	if (boards[0].category) {
		result.boardsByCategory = groupBoardsByCategory(
			boards.filter(board => !board.isHidden),
			getChan().boardCategories
		)
	}
	return result
}

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
function groupBoardsByCategory(boards, categoriesOrder = []) {
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