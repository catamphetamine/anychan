/**
 * Parses response board JSON object.
 * @param  {object} board — Response board JSON object.
 * @return {object} See README.md for "Board" object description.
 */
export default function parseBoard(board) {
	const parsedBoard = {
		id: board.id,
		name: board.name,
		description: board.info,
		category: board.category,
		commentsPerHour: board.speed,
		bumpLimit: board.bump_limit
	}
	if (board.enable_names === 1) {
		parsedBoard.showNames = true
	}
	if (board.enable_sage === 1) {
		parsedBoard.isSageAllowed = true
	}
	if (board.category === 'Разное' || board.category === 'Взрослым') {
		board.isNotSafeForWork = true
	}
	return parsedBoard
}