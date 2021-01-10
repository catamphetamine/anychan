import censorWords from 'social-components/commonjs/utility/post/censorWords'
import getInlineContentText from 'social-components/commonjs/utility/post/getInlineContentText'

import addParseContent from './addParseContent'
import transformText from './transformText'

/**
 * Sets utility properties on thread comments.
 * @param {object} thread
 * @param {string} options.mode — Either "thread" (viewing thread page) or "channel" (viewing channel page).
 * @param {object} options.votes — Own votes in this thread, read from `localStorage`. An object of shape: `{ [commentId]: 1 or -1, ... }`.
 */
export default function addCommentProps(thread, {
	mode,
	votes,
	// messages,
	locale,
	grammarCorrection,
	censoredWords
}) {
	const openingComment = thread.comments[0]
	// `isRootComment` is used for showing full-size attachment thumbnail
	// on main thread posts on `4chan.org`.
	// Also it used in `./CommentAuthor` to not show "original poster" badge
	// on the opening post of a thread.
	openingComment.isRootComment = true
	// `isBumpLimitReached`, `isSticky` and others are used for post header badges.
	for (const property of FIRST_COMMENT_PROPERTIES_OF_A_THREAD) {
		openingComment[property] = thread[property]
	}
	const hasAuthorIds = thread.comments.some(comment => comment.authorId)
	let i = 0
	while (i < thread.comments.length) {
	// for (const comment of thread.comments) {
		const comment = thread.comments[i]
		// `comment.indexForLatestReadCommentDetection`
		// is used in `<CommentReadStatusWatcher/>`
		// (on both Channel and Thread pages)
		// and also in `createTrackedThreadRecord()`.
		comment.indexForLatestReadCommentDetection = i
		// Set "thread shows author IDs" flag.
		comment.threadHasAuthorIds = hasAuthorIds
		// Set viewing mode ("channel", "thread").
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
		// Modify the `comment`'s `.parseContent()` function a bit.
		addParseContent(comment, {
			mode,
			thread,
			grammarCorrection,
			censoredWords,
			locale,
			// messages
		})
		// Transform and censor comment title.
		if (comment.title) {
			comment.title = transformText(comment.title, {
				grammarCorrection,
				locale,
				replaceQuotes: true
			})
			if (censoredWords) {
				const titleCensored = censorWords(comment.title, censoredWords)
				if (titleCensored !== comment.title) {
					comment.titleCensoredContent = titleCensored
					comment.titleCensored = getInlineContentText(titleCensored)
				}
			}
		}
		i++
	}
}

export const FIRST_COMMENT_PROPERTIES_OF_A_THREAD = [
	// Comments count / attachments count / unique posters count — 
	// those are shown on the fist comment.
	'commentsCount',
	'attachmentsCount',
	'uniquePostersCount',
	// Header badges.
	'isSticky',
	'isRolling',
	'isLocked',
	// Bump limit indicator.
	'isBumpLimitReached'
]