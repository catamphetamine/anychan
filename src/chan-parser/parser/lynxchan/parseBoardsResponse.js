import parseBoard from './parseBoard'

/**
 * Parses chan API response for boards list.
 * @param  {object} response — Chan API response for boards list.
 * @return {object[]} See README.md for "Board" object description.
 */
export default function parseBoards(response, { chan }) {
	// `lynxchan` doesn't provide a "get boards list" API URL.
	// Only 10 `topBoards` in `/index.json`.
	return response.topBoards.map(parseBoard)
}