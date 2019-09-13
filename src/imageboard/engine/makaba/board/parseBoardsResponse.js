import parseBoard from './parseBoard'

/**
 * Parses chan API response for boards list.
 * @param  {object} response — Chan API response for boards list.
 * @return {object[]} See README.md for "Board" object description.
 */
export default function parseBoardsResponse(response, { hideBoardCategories }) {
	// Parse tags.
	const boardTags = {}
	for (const tag of response.tags) {
		boardTags[tag.board] = boardTags[tag.board] || []
		boardTags[tag.board].push(tag.tag)
	}
	// Parse boards.
	return response.boards.map(board => parseBoard(board, boardTags))
}