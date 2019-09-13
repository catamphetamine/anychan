import parseThread from './parseThread'

/**
 * Parses "get thread comments" API response.
 * @param  {object} response — "get thread comments" API response.
 * @return {object} `{ thread, comments }`
 */
export default function parseThreadResponse(response) {
	return {
		thread: parseThread(response.posts[0]),
		comments: response.posts
	}
}