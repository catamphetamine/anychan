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
			// Remove leading `post-link` quote if it's
			// quoting the "opening" post of the thread.
			// Only removes the first such OP quote,
			// because sometimes people intentionally
			// quote OP post multiple times in a row
			// in their comment (for whatever reasons).
			//
			// `comment.parseContent()` can be called multiple times:
			// for example, if `options.exhaustive` is `false`,
			// `content.parse` is not set to an empty function at the end
			// because the comment will (probably) be parsed again
			// (this time, normally) at some future.
			// Therefore, a special flag is added so that it only
			// removes the leading OP quote once: this way it doesn't
			// remove an OP quote the second time if the quote is present
			// at the start of a comment multiple times in a row.
			//
			if (!comment._removedLeadingOriginalPostQuote) {
				comment._removedLeadingOriginalPostQuote = true
				const result = removeLeadingOriginalPostQuote(comment.content, thread)
				if (result) {
					// Also remove the first OP quote from comment's "preview".
					removeLeadingOriginalPostQuote(comment.contentPreview, thread)
				} else if (result === null) {
					// Clear comment's content (and its "preview" then).
					comment.content = undefined
					comment.contentPreview = undefined
				}
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

/**
 * Removes leading `post-link` quote if it's quoting the "opening" post
 * of the thread. Only removes the first such OP quote, because sometimes
 * people intentionally quote OP post multiple times in a row in their
 * comment (for whatever reasons).
 * @param {(string|any[])} content — Comment content.
 * @param {object} thread — Thread info (thread id and board id).
 * @return {(boolean|null)} [removed] — Returns `true` if a leading OP quote has been removed. Returns `null` if comment's content should be cleared.
 */
function removeLeadingOriginalPostQuote(content, thread) {
	if (content && Array.isArray(content)) {
		const firstBlock = content[0]
		if (Array.isArray(firstBlock)) {
			const firstInlineElement = firstBlock[0]
			if (firstInlineElement.type === 'post-link') {
				const postLink = firstInlineElement
				if (postLink.boardId === thread.boardId &&
						postLink.threadId === thread.id &&
						postLink.postId === thread.id) {
					// If the first paragraph only consists of an OP quote.
					if (firstBlock.length === 1) {
						// If there're no more paragraphs in this comment,
						// then remove the the entire comment's content.
						if (content.length === 1) {
							return null
						} else {
							// Else, just remove the first paragraph of the comment.
							content.splice(0, 1)
							return true
						}
					} else {
						// Remove the OP quote and `<br/>` after it
						// from the first paragraph of the comment.
						firstBlock.splice(0, 2)
						return true
					}
				}
			}
		}
	}
}