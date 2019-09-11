import parseThread from './parseThread'
import getBoardSettings from '../board/getBoardSettings'

/**
 * Parses chan API response for threads list.
 * @param  {object} response — Chan API response for threads list.
 * @param  {object} options
 * @return {object[]} See README.md for "Thread" object description.
 */
export default function parseThreads(response, options) {
	return response.threads.map((thread) => parseThread(thread, [thread], {
		...options,
		boardTitle: response.BoardName,
		bumpLimit: response.bump_limit,
		boardSettings: getBoardSettings(response),
		defaultAuthorName: response.default_name,
		commentsCount: thread.posts_count,
		// `files_count` is incorrect:
		// https://github.com/catamphetamine/captchan/blob/master/docs/makaba.md
		commentAttachmentsCount: thread.files_count,
		hasVoting: response.enable_likes === 1,
		hasFlags: response.enable_flags === 1,
		icons: response.enable_icons === 1 && response.icons && response.icons.reduce((icons, { name, num }) => {
			icons[name] = num
			return icons
		}, {})
	}))
}