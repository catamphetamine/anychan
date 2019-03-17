import parseBoard from './parseBoard'

/**
 * Parses chan API response for boards list.
 * @param  {object} response — Chan API response for boards list.
 * @return {object[]} See README.md for "Board" object description.
 */
export default function parseBoards(response, { boardCategoriesExclude }) {
	// Parse tags.
	const boardTags = {}
	for (const tag of response.tags) {
		boardTags[tag.board] = boardTags[tag.board] || []
		boardTags[tag.board].push(tag.tag)
	}
	// Parse boards.
	const boards = response.boards.map(board => parseBoard(board, boardTags))
	// Hide "user" boards.
	for (const board of boards) {
		if (board.category === boardCategoriesExclude) {
			board.isHidden = true
		}
	}
	// "/abu/*" redirects to "/api" which breaks `/catalog.json` HTTP request.
	for (const board of boards) {
		if (board.id === 'abu') {
			board.id = 'api'
		}
	}
	return boards
}