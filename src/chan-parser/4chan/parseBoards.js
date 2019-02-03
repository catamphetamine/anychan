import parseBoard from './parseBoard'

/**
 * Parses chan API response for boards list.
 * @param  {object} response — Chan API response for boards list
 * @return {object}
 * @example
 * // Returns:
 * // {
 * //   boards: [{
 * //     id: 'vg',
 * //     name: 'Video Games',
 * //     description: 'Video Games discussions'
 * //   }, ...]
 * // }
 * parseBoards(response)
 */
export default function parseBoards(response) {
	const boards = response.boards.map(parseBoard)
	return {
		boards
	}
}