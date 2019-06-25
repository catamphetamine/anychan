import parseBoard from './parseBoard'
import parseBoardEightChan from './parseBoard.8ch'

/**
 * Parses chan API response for boards list.
 * @param  {object} response — Chan API response for boards list.
 * @return {object[]} See README.md for "Board" object description.
 */
export default function parseBoards(response, { chan }) {
	if (chan === '8ch') {
		return response.map(parseBoardEightChan)
	}
	return response.boards.map(parseBoard)
}