import { loadResourceLinksSync } from '../../utility/loadResourceLinks'
import visitPostParts from 'social-components/commonjs/utility/post/visitPostParts'

/**
 * Sets utility properties on thread comments.
 * @param {object} thread
 * @param {string} options.mode — Either "thread" (viewing thread page) or "board" (viewing board page).
 * @param {object} options.votes — Own votes in this thread, read from `localStorage`. An object of shape: `{ [commentId]: 1 or -1, ... }`.
 */
export default function addCommentProps(thread, { mode, votes, messages }) {
	const openingComment = thread.comments[0]
	openingComment.commentsCount = thread.commentsCount
	openingComment.attachmentsCount = thread.attachmentsCount
	openingComment.uniquePostersCount = thread.uniquePostersCount
	// `isRootComment` is used for showing full-size attachment thumbnail
	// on main thread posts on `4chan.org`.
	// Also it used in `./CommentAuthor` to not show "original poster" badge
	// on the opening post of a thread.
	openingComment.isRootComment = true
	// `isBumpLimitReached`, `isSticky` and others are used for post header badges.
	openingComment.isBumpLimitReached = thread.isBumpLimitReached
	openingComment.isSticky = thread.isSticky
	openingComment.isRolling = thread.isRolling
	openingComment.isLocked = thread.isLocked
	const hasAuthorIds = thread.comments.some(comment => comment.authorId)
	for (const comment of thread.comments) {
		// Set "thread shows author IDs" flag.
		comment.threadHasAuthorIds = hasAuthorIds
		// Set viewing mode (board, thread).
		comment.mode = mode
		// If the user has previously voted for this comment,
		// set the vote value (`1` -> `true` or `-1` -> `false`)
		// on the comment.
		if (votes[comment.id] !== undefined) {
			switch (votes[comment.id]) {
				case 1:
					comment.vote = true
					break
				case -1:
					comment.vote = false
					break
				// Before 05-08-2020, votes were stored as `true`/`false`
				// rather than `1`/`-1`.
				case true:
					comment.vote = true
					break
				case false:
					comment.vote = false
					break
			}
		}
		// Load resource links from cache in `.parseContent()`.
		const parseContent = comment.parseContent
		comment.parseContent = () => {
			parseContent()
			// Run "loadResourceLinksSync()" on the "previous" comments
			// that are shown when the user clicks "Show Previous",
			// so that YouTube videos are loaded from cache in order to
			// prevent `VirtualScroller` items from "jumping"
			// as the user then scrolls up.
			// This function will also be called when showing new comments,
			// but that's not the purpose in this case.
			loadResourceLinksSync(comment, { mode, messages })
			if (mode === 'thread') {
				enumeratePostLinks(comment)
			}
			// Remove leading `post-link` quotes if they're
			// quoting the "opening" post of the thread.
			if (!comment.removedLeadingOriginalPostQuotes) {
				if (comment.content &&
					Array.isArray(comment.content) &&
					Array.isArray(comment.content[0]) &&
					comment.content[0][0].type === 'post-link' &&
					comment.content[0][0].boardId === thread.boardId &&
					comment.content[0][0].threadId === thread.id &&
					comment.content[0][0].postId === thread.id) {
					// Remove the `post-link` quote and `<br/>` after it.
					if (comment.content[0].length === 1) {
						if (comment.content.length === 1) {
							comment.content = undefined
						} else {
							comment.content.splice(0, 1)
						}
					} else {
						comment.content[0].splice(0, 2)
					}
				}
				comment.removedLeadingOriginalPostQuotes = true
			}
		}
	}
}

/** Set `post-link` ids. This is to identify them later
 * when restoring `VirtualScroller` state on scroll or
 * "Back" navigation so that those that were expanded
 * stay expanded.
 */
function enumeratePostLinks(comment) {
	let i = 1
	visitPostParts('post-link', (postLink) => {
		postLink._id = i
		i++
	}, comment.content)
}