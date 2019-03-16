import parseThread from './parseThread'

/**
 * Parses chan API response for threads list.
 * @param  {object} response — Chan API response for threads list.
 * @param  {object} options
 * @return {object[]} See README.md for "Thread" object description.
 */
export default function parseThreads(response, options) {
	return response.threads.map((thread) => parseThread(thread, [thread], {
		...options,
		bumpLimit: response.bump_limit,
		defaultAuthorName: response.default_name,
		commentsCount: thread.posts_count,
		commentAttachmentsCount: thread.files_count
	}))
}