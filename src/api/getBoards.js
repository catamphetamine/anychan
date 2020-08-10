import Chan from './Chan'
import { getChan, getChanId } from '../chan'

/**
 * Returns a list of boards.
 * @param  {object} options.http — `react-pages` `http` utility.
 * @param  {boolean} options.all — If set to `true`, then the "full" list of boards is returned. Some imageboars require creating "user boards", and, for example, `8ch.net` had about 20,000 of such "user boards".
 * @return {object} Returns `{ [boards], [boardsByPopularity], [boardsByCategory], [allBoards: { boards, [boardsByPopularity], [boardsByCategory] }], [hasMoreBoards] }`. If an imageboard doesn't differentiate between a "short" list of boards and a "long" list of boards then both `boards` and `allBoards` are returned and are the same. Otherwise, either `boards` and `hasMoreBoards: true` or `allBoards: { boards }` are returned. Along with `boards` (or `allBoards.boards`), `boardsByPopularity` and `boardsByCategory` could also be returned (if the imageboard provides those).
 */
export default async function getBoards({ http, all }) {
	// // Development process optimization: use a cached list of `2ch.hk` boards.
	// // (to aviod the delay caused by a CORS proxy)
	// if (process.env.NODE_ENV !== 'production' && getBoardsExample(getChanId())) {
	// 	response = getBoardsExample(getChanId())
	// }
	const chan = Chan({ http })
	let boards = await (all ? chan.getAllBoards() : chan.getBoards())
	// Mark hidden boards.
	if (!all) {
		markHiddenBoards(boards)
	}
	// "/abu/*" redirects to "/api" which breaks `/catalog.json` HTTP request.
	if (getChanId() === '2ch') {
		boards = boards.filter(_ => _.id !== 'abu')
	}
	const result = getBoardsResult(boards)
	if (!chan.hasMoreBoards()) {
		return {
			...result,
			allBoards: result
		}
	}
	if (all) {
		return {
			allBoards: result
		}
	}
	return {
		...result,
		hasMoreBoards: true
	}
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

/**
 * Returns the list(s) of boards.
 * @param  {object} options.http — `react-pages` `http` utility.
 * @param  {boolean} options.all — If set to `true`, then the "full" list of boards is returned. Some imageboars require creating "user boards", and, for example, `8ch.net` had about 20,000 of such "user boards".
 * @return {object} `{ boards, [boardsByPopularity], [boardsByCategory] }`. Along with `boards` (or `allBoards.boards`), `boardsByPopularity` and `boardsByCategory` could also be returned (if the imageboard provides those).
 */
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

function markHiddenBoards(boards) {
	const hideBoardCategories = getChan().hideBoardCategories
	if (hideBoardCategories) {
		for (const board of boards) {
			if (hideBoardCategories.indexOf(board.category) >= 0) {
				// Special case for `2ch.hk`'s `/int/` board which happens to be
				// in the ignored category but shouldn't be hidden.
				if (getChanId() === '2ch' && board.id === 'int') {
					continue
				}
				board.isHidden = true
			}
		}
	}
}