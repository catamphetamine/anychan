import parseThread from './parseThread'
import getBoardSettings from './getBoardSettings'

/**
 * Parses chan API response for thread comments list.
 * @param  {object} response — Chan API response for thread comments list
 * @param  {object} options
 * @return {object} See README.md for "Thread" object description.
 */
export default function parseThreadResponse(response, options) {
	const parsedThread = parseThread(response.threads[0], response.threads[0].posts, {
		...options,
		boardTitle: response.BoardName,
		bumpLimit: response.bump_limit,
		boardSettings: getBoardSettings(response),
		defaultAuthorName: response.default_name,
		commentsCount: response.posts_count,
		// `files_count` is incorrect, even with `1` subtracted from it:
		// https://github.com/catamphetamine/captchan/blob/master/docs/makaba.md
		commentAttachmentsCount: response.files_count - 1,
		hasVoting: response.enable_likes === 1,
		hasFlags: response.enable_flags === 1,
		icons: response.enable_icons === 1 && response.icons && response.icons.reduce((icons, { name, num }) => {
			icons[name] = num
			return icons
		}, {})
	})
	// Only for `/res/THREAD-ID.json` API response.
	if (response.unique_posters) {
		parsedThread.uniquePostersCount = parseInt(response.unique_posters)
	}
	return parsedThread
}