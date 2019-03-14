import parseThread from './parseThread'

/**
 * Parses chan API response for threads list.
 * @param  {object} response — Chan API response for threads list.
 * @param  {object} options
 * @return {object[]} See README.md for "Thread" object description.
 */
export default function parseThreads(response, options) {
	const threads = response.reduce((all, page) => all.concat(page.threads), [])
	return threads.map((thread) => parseThread(thread, [thread], options))
}