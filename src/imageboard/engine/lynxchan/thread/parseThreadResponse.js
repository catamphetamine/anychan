import parseThread from './parseThread'

/**
 * Parses chan API response for thread comments list.
 * @param  {object} response — Chan API response for thread comments list
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThreadResponse(response, options) {
	return parseThread(response, options)
}