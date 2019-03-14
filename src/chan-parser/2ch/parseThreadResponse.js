import parseThread from './parseThread'

/**
 * Parses chan API response for thread comments list.
 * @param  {object} response — Chan API response for thread comments list
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThreadResponse(response, options) {
	return parseThread(response.threads[0], response.threads[0].posts, {
		...options,
		bumpLimit: response.bump_limit,
		maxCommentLength: response.max_comment,
		maxAttachmentsSize: response.max_files_size,
		defaultAuthorName: response.default_name,
		commentsCount: response.posts_count,
		attachmentsCount: response.files_count
	})
}