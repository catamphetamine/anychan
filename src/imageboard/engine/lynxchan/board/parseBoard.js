import unescapeContent from '../../../utility/unescapeContent'

/**
 * Parses response board JSON object.
 * @param  {object} board — Response board JSON object.
 * @return {object} See README.md for "Board" object description.
 */
export default function parseBoard(board) {
	return {
		id: board.boardUri,
		title: board.boardName
	}
}