import censorWords from 'social-components/utility/post/censorWords.js'
import getInlineContentText from 'social-components/utility/post/getInlineContentText.js'

import addParseContent from './addParseContent.js'
import transformText from './transformText.js'

/**
 * Sets utility properties on thread comments.
 * @param {object} thread
 * @param {string} options.mode — Either "thread" (viewing thread page) or "channel" (viewing channel page).
 * @param {object} options.votes — Own votes in this thread, read from `localStorage`. An object of shape: `{ [commentId]: 1 or -1, ... }`.
 * @param {number[]} options.ownCommentIds — Comment/thread ownership status: included IDs are "owned".
 * @param {number[]} options.hiddenCommentIds — Comment/thread "hidden" status: included IDs are "hidden".
 * @param {number[]} options.ignoredAuthors — The IDs of the "ignored" authors.
 */
export default function addCommentProps(thread, {
	mode,
	// (this feature is not currently used)
	// `4chan.org` provides a "-tail" API for getting thread comments
	// that reduces the traffic for a little bit by only returning
	// the last 50 comments or so.
	// If that "-tail" API would've been used, `fromIndex` would point
	// to the index of the first "-tail" comment in the "old" (before refresh)
	// thread comments list.
	fromIndex = 0,
	votes,
	ownCommentIds,
	hiddenCommentIds,
	ignoredAuthors,
	hasAuthorIds,
	// onHasAuthorIds,
	// messages,
	grammarCorrection,
	censoredWords,
	locale
}) {
	if (fromIndex === 0) {
		addRootCommentProps(thread)
	}

  // Even when a thread uses `authorIds` for its comments, not all of them
  // might have it. For example, on `4chan`, users with "capcodes" (moderators, etc)
  // don't have an `authorId`.
  if (!hasAuthorIds) {
		hasAuthorIds = thread.comments.some(comment => comment.authorId)
		// if (hasAuthorIds) {
		// 	onHasAuthorIds()
		// }
	}

	const _addCommentProps = (comment, { index, viewingMode = mode }) => {
		// Set `comment.index`.
		comment.index = index

		if (hasAuthorIds) {
			// Set "thread shows author IDs" flag.
			comment.threadHasAuthorIds = hasAuthorIds

			// Mark the comment as "hidden" if its author is ignored.
			if (comment.authorId) {
				if (ignoredAuthors.includes(comment.authorId)) {
					comment.hidden = true
				}
			}
		}

		// Set viewing mode ("channel", "thread").
		comment.viewingMode = viewingMode

		// If the user has previously voted for this comment,
		// set the vote value (`1` -> `true` or `-1` -> `false`)
		// on the comment.
		addCommentVote(comment, votes)

		// Set ownership status.
		if (ownCommentIds.includes(comment.id)) {
			comment.ownCommentIds = true
		}

		// Set hidden status.
		if (hiddenCommentIds.includes(comment.id)) {
			comment.hidden = true
		}

		// Set `channelIdForCountryFlag` property.
		comment.channelIdForCountryFlag = thread.channelId

		// Modify the `comment`'s `.parseContent()` function a bit.
		addParseContent(comment, {
			mode,
			channelId: thread.channelId,
			threadId: thread.id,
			grammarCorrection,
			censoredWords,
			locale,
			// messages
		})

		if (comment.title) {
			// Transform and censor comment title.
			transformCommentTitle(comment, {
				grammarCorrection,
				censoredWords,
				locale
			})
		}
	}

	let i = 0
	for (const comment of thread.comments) {
		_addCommentProps(comment, {
			index: fromIndex + i
		})
		i++
	}

	if (mode === 'channel' && thread.latestComments) {
		for (const comment of thread.latestComments) {
			_addCommentProps(comment, {
				viewingMode: 'channel-latest-comments'
			})
		}

		// This is just a "hack" to make "latest comments" be rendered as "replies" in a comment tree.
		thread.comments[0].replies = thread.latestComments
	}
}

function addRootCommentProps(thread) {
	const rootComment = thread.comments[0]
	// `isRootComment` is used for showing full-size attachment thumbnail
	// on main thread posts on `4chan.org`.
	// Also it used in `./CommentAuthor` to not show "original poster" badge
	// on the opening post of a thread.
	rootComment.isRootComment = true
	// `bumpLimitReached`, `onTop` and others are used for post header badges.
	for (const property of ROOT_COMMENT_PROPERTIES_OF_A_THREAD) {
		rootComment[property] = thread[property]
	}
}

export const ROOT_COMMENT_PROPERTIES_OF_A_THREAD = [
	// Comments count / attachments count / unique posters count — 
	// those are shown on the fist comment.
	'commentsCount',
	'attachmentsCount',
	'uniquePostersCount',
	// Header badges.
	'onTop',
	'trim',
	'archived',
	'locked',
	// Bump limit indicator.
	'bumpLimitReached'
]

function addCommentVote(comment, votes) {
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
}

function transformCommentTitle(comment, { censoredWords, grammarCorrection, locale }) {
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
		} else {
			comment.titleCensoredContent = comment.title
			comment.titleCensored = comment.title
		}
	}
}