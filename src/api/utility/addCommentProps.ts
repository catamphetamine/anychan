import type { Comment, CommentFromDataSource, RootCommentPropertiesOfThread, Thread, ThreadFromDataSource, Messages, UserSettingsJson, DataSource, ChannelLayout, Mode } from '../../types/index.js'

import { censorWords, getInlineContentText } from 'social-components/content'

import addParseContent from './addParseContent.js'
import addCommentTextFunctions from './addCommentTextFunctions.js'
import convertAttachmentUrlsToAbsolute from './convertAttachmentUrlsToAbsolute.js'
import transformText from './transformText.js'

import isDeployedOnDataSourceDomain from '../../utility/dataSource/isDeployedOnDataSourceDomain.js'

interface Parameters {
	mode: Mode;
	// `channelLayout` is only required when `mode` is "channel".
	channelLayout?: ChannelLayout;
	// (this feature is not currently used)
	// `4chan.org` provides a "-tail" API for getting thread comments
	// that reduces the traffic for a little bit by only returning
	// the last 50 comments or so.
	// If that "-tail" API would've been used, `fromIndex` would point
	// to the index of the first "-tail" comment in the "old" (before refresh)
	// thread comments list.
	fromIndex?: number;
	// I dunno why are there `true` and `false` here.
	votes?: Record<string, 1 | -1 | true | false>;
	ownCommentIds: CommentFromDataSource['id'][];
	hiddenCommentIds: CommentFromDataSource['id'][];
	ignoredAuthors: string[];
	hasAuthorIds?: boolean;
	messages: Messages;
	grammarCorrection: UserSettingsJson['grammarCorrection'];
	censoredWords: UserSettingsJson['censoredWords'];
	locale: UserSettingsJson['locale'];
	dataSource: DataSource;
}

/**
 * Adds some utility properties on thread comments.
 *
 * It "mutates" the `comment` object rather than creating a new copy of it.
 * That behavior is intentional: because `getCommentById()` function is created initially
 * and then not updated, all references to all `comment` objects should stay the same
 * throughout the whole lifecycle of a thread.
 *
 * It also "mutates" the `thread` object because: (a) such approach doesn't cause any issues and
 * (b) it has been written like this originally so it's not very clear if changing that aspect
 * could hypothetically cause any issues.
 *
 * @param {object} thread
 * @param {object} options
 * @param {string} options.mode — Either "thread" (viewing thread page) or "channel" (viewing channel page).
 * @param {object} options.votes — Own votes in this thread, read from `localStorage`. An object of shape: `{ [commentId]: 1 or -1, ... }`.
 * @param {number[]} options.ownCommentIds — Comment/thread ownership status: included IDs are "owned".
 * @param {number[]} options.hiddenCommentIds — Comment/thread "hidden" status: included IDs are "hidden".
 * @param {number[]} options.ignoredAuthors — The IDs of the "ignored" authors.
 */
export default function addCommentProps(thread: ThreadFromDataSource, {
	mode,
	channelLayout,
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
	messages,
	grammarCorrection,
	censoredWords,
	locale,
	dataSource
}: Parameters) {
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

	const _addCommentProps = (commentFromDataSource: CommentFromDataSource, {
		index,
		viewingMode = mode
	}: {
		index?: number,
		viewingMode?: 'channel' | 'channel-latest-comments' | 'thread'
	}) => {
		// New properties will be added to `thread` object.
		// This assignment is to work around TypeScript errors
		// while those properties are being added one-by-one.
		const comment = commentFromDataSource as Partial<Comment>

		// If a data source returns `comment.content[]` that is already parsed as `Content`
		// then there's no requirement for `comment.parseContent()` to exist.
		if (!comment.parseContent) {
			comment.parseContent = () => {}
			comment.hasContentBeenParsed = () => true
		}

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

		// Set "own comment" status.
		if (ownCommentIds.includes(comment.id)) {
			comment.own = true
		}

		// Set "reply to own comment" status.
		if (comment.inReplyTo) {
			comment.inReplyTo.some((inReplyToComment) => {
				if (ownCommentIds.includes(inReplyToComment.id)) {
					comment.isReplyToOwnComment = true
				}
			})
		}

		// Set hidden status.
		if (hiddenCommentIds.includes(comment.id)) {
			comment.hidden = true
		}

		// Set `channelIdForCountryFlag` property.
		comment.channelIdForCountryFlag = thread.channelId

		// Modify the `comment`'s `.parseContent()` function a bit.
		if (comment.parseContent) {
			addParseContent(comment, {
				mode,
				channelId: thread.channelId,
				threadId: thread.id,
				channelLayout,
				grammarCorrection,
				censoredWords,
				locale,
				dataSource,
				// messages
			})
		}

		// Adds text-related utility functions to `comment`:
		// * `getContentText()`
		// * `getContentTextSingleLine()`
		// * `getContentTextSingleLineLowerCase()`
		addCommentTextFunctions(comment as Comment, { messages })

		// Transform and censor comment title.
		if (comment.title) {
			transformCommentTitle(comment, {
				grammarCorrection,
				censoredWords,
				locale
			})
		}

		// Convert relative attachment URLs into absolute ones
		// in case of not running on an imageboard's "official" domain.
		// (for example, when running on the `anychan` demo website)
		if (!isDeployedOnDataSourceDomain(dataSource) && !dataSource.keepRelativeAttachmentUrls) {
			if (comment.attachments) {
				for (const attachment of comment.attachments) {
					convertAttachmentUrlsToAbsolute(attachment, { dataSource })
				}
			}
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
		thread.comments[0].replies = thread.latestComments as Comment[]
	}
}

function addRootCommentProps(thread: ThreadFromDataSource) {
	const rootComment = thread.comments[0] as Partial<Comment>
	// `isRootComment` is used for showing full-size attachment thumbnail
	// on main thread posts on `4chan.org`.
	// Also it used in `./CommentAuthor` to not show "original poster" badge
	// on the opening post of a thread.
	rootComment.isRootComment = true

	// `bumpLimitReached`, `pinned` and others are used for post header badges.
	for (const property of ROOT_COMMENT_PROPERTIES_OF_A_THREAD) {
		// I dunno what the TypeScript says:
		// "Type 'number | boolean' is not assignable to type 'never'"
		// @ts-expect-error
		rootComment[property] = thread[property]
	}

	// Copy `thread.commentAttachmentsCount` property to the root comment.
	rootComment.commentAttachmentsCount = (thread as Thread).commentAttachmentsCount
}

// 	const rootComment = {
// 		...thread.comments[0],

// 		// `isRootComment` is used for showing full-size attachment thumbnail
// 		// on main thread posts on `4chan.org`.
// 		// Also it used in `./CommentAuthor` to not show "original poster" badge
// 		// on the opening post of a thread.
// 		isRootComment: true
// 	}

// 	// `bumpLimitReached`, `pinned` and others are used for post header badges.
// 	for (const property of ROOT_COMMENT_PROPERTIES_OF_A_THREAD) {
// 		rootComment[property] = thread[property]
// 	}

// 	return {
// 		...thread,
// 		comments: [
// 			rootComment,
// 			...thread.comments.slice(1)
// 		]
// 	}
// }

export const ROOT_COMMENT_PROPERTIES_OF_A_THREAD: (keyof RootCommentPropertiesOfThread)[] = [
	// Comments count / attachments count / unique posters count — 
	// those are shown on the fist comment.
	'commentsCount',
	'attachmentsCount',
	'uniquePostersCount',
	// Header badges.
	'pinned',
	'trimming',
	'archived',
	'locked',
	// Bump limit indicator.
	'bumpLimitReached'
]

function addCommentVote(
	comment: Partial<Comment>,
	// I dunno why are there `true` and `false` here.
	votes: Record<string, -1 | 1 | true | false>
) {
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

function transformCommentTitle(comment: Partial<Comment>, {
	censoredWords,
	grammarCorrection,
	locale
}: {
	censoredWords: UserSettingsJson['censoredWords'];
	grammarCorrection: UserSettingsJson['grammarCorrection'];
	locale: UserSettingsJson['locale'];
}) {
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