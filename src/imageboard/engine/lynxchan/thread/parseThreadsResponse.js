import parseThread from './parseThread'

/**
 * Parses "get threads list" API response.
 * @param  {object} response — "get threads list" API response.
 * @return {object} `{ threads, comments }`
 */
export default function parseThreadsResponse(response) {
	return {
		threads: response.map(parseThread),
		comments: response
	}
}