import parseThread from './parseThread'

/**
 * Parses "get threads list" API response.
 * @param  {object} response — "get threads list" API response.
 * @return {object} `{ threads, comments }`
 */
export default function parseThreadsResponse(response) {
	const threads = response.reduce((all, page) => all.concat(page.threads), [])
	return {
		threads: threads.map(parseThread),
		comments: threads
	}
}