import getBoardInfo from '../board/getBoardInfo'

/**
 * Parses "get thread comments" API response.
 * @param  {object} response — "get thread comments" API response.
 * @return {object} `{ board, thread, comments }`.
 */
export default function parseThreadResponse(response) {
	const {
		current_thread,
		posts_count,
		files_count,
		unique_posters
	} = response
	const openingPost = response.threads[0].posts[0]
	return {
		board: {
			defaultAuthorName: response.default_name,
			...getBoardInfo(response)
		},
		comments: response.threads[0].posts,
		thread: {
			id: parseInt(current_thread),
			commentsCount: posts_count,
			// `unique_posters` is only present in "get thread comments" API response.
			uniquePostersCount: parseInt(unique_posters),
			// `files_count` is incorrect, even with `1` subtracted from it:
			// https://github.com/catamphetamine/captchan/blob/master/docs/makaba.md
			commentAttachmentsCount: files_count - 1,
			isLocked: openingPost.closed === 1,
			isRolling: openingPost.endless === 1,
			// If the thread is pinned `sticky` will be a number greater than `0`.
			isSticky: openingPost.sticky > 0,
			updatedAt: new Date(openingPost.lasthit * 1000)
		}
	}
}