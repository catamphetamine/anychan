// import { loadResourceLinksSync } from '../../utility/loadResourceLinks'
import setEmbeddedAttachmentsProps from '../../utility/setEmbeddedAttachmentsProps'
import getCommentLengthLimit from '../../utility/getCommentLengthLimit'
import transformText from './transformText'

import generatePostPreview from 'social-components/commonjs/utility/post/generatePostPreview'
import visitPostParts from 'social-components/commonjs/utility/post/visitPostParts'
import censorWords from 'social-components/commonjs/utility/post/censorWords'
import getInlineContentText from 'social-components/commonjs/utility/post/getInlineContentText'
import transformContent from 'social-components/commonjs/utility/post/transformContent'
import trimInlineContent from 'social-components/commonjs/utility/post/trimInlineContent'

/**
 * Sets utility properties on thread comments.
 * @param {object} thread
 * @param {string} options.mode — Either "thread" (viewing thread page) or "channel" (viewing channel page).
 * @param {object} options.votes — Own votes in this thread, read from `localStorage`. An object of shape: `{ [commentId]: 1 or -1, ... }`.
 */
export default function addCommentProps(thread, {
	mode,
	votes,
	messages,
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
		// Load resource links from cache in `.parseContent()`.
		const parseContent = comment.parseContent
		comment.parseContent = ({ getCommentById }) => {
			// The `comment` object reference might have changed
			// during thread auto-update since this function has been
			// initially created. Therefore, get the latest `comment`
			// object reference.
			if (getCommentById) {
				comment = getCommentById(comment.id)
			}
			// `.hasContentBeenParsed` flag is set by the `parseContent()`
			// function that the `imageboard` library has created.
			// Don't set this flag manually. Only read it.
			if (comment.hasContentBeenParsed) {
				return
			}
			parseContent({ getCommentById })
			// Transform and censor comment content.
			if (comment.content) {
				const _transformContent = (content) => {
					let unpairedQuoteEncountered
					transformContent(content, (part) => {
						if (typeof part === 'string') {
							part = transformText(part, {
								grammarCorrection,
								locale,
								// If an "unpaired" quote is encountered anywhere in a comment
								// then don't replace the rest of the quote characters.
								// The rationale is that once an "unparied" quote is encountered
								// the correctness of the result is no longer guaranteed.
								// So, this won't work in cases like `"<bold>text</bold>"`,
								// but it's considered to be better to leave it as it is
								// rather than produce a percievably incorrect result.
								replaceQuotes: !unpairedQuoteEncountered,
								onUnpairedQuote() {
									unpairedQuoteEncountered = true
								}
							})
							if (censoredWords) {
								part = censorWords(part, censoredWords)
							}
							return part
						}
						// Don't change "code" parts:
						// don't autocorrect "grammar errors" in code.
						// Example: don't change "parent.child = value"
						// into "parent. Child = value".
						if (part.type === 'code') {
							return false
						}
						// Don't change "link" parts:
						// don't autocorrect website URLs "grammar errors".
						// Example: don't change "дом.рф" into "дом. Рф"
						// because it's not two sentences.
						if (part.type === 'link') {
							return false
						}
					})
				}
				_transformContent(comment.content)
				if (comment.contentPreview) {
					_transformContent(comment.contentPreview)
				}
			}
			// Eventually, it was decided that perhaps `loadResourceLinksSync()`
			// function isn't that useful and can be removed.
			// // `loadResourceLinksSync()` is a simple "synchronous"
			// // alternative of `loadResourceLinks()` that only loads those
			// // resource links that're present in the "cache".
			// // Currently, there's only a cache for YouTube videos,
			// // and it's rather small, so maybe `loadResourceLinksSync()`
			// // doesn't make a lot of sense. But since it has been written,
			// // it's used here to potentially load some YouTube videos
			// // instantaneously rather than "asynchronously".
			// // Synchronous resource loading is better in that it doesn't
			// // result in the page scroll "jumping" when the user starts
			// // looking through "previous" comments by clicking
			// // "Show previous comments" button and then scrolling from bottom to top.
			// loadResourceLinksSync(comment, { mode, messages, getCommentById: ... thread.getCommentById ... })
			// Align attachments to the left.
			setEmbeddedAttachmentsProps(comment)
			if (mode === 'thread') {
				setPostLinkProps(comment)
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
					// If removed a leading OP quote from the comment's content,
					// then re-generate the preview (if it existed before).
					if (comment.contentPreview) {
						comment.contentPreview = generatePostPreview(comment, {
							maxLength: getCommentLengthLimit(mode)
						})
					}
				} else if (result === null) {
					// Clear comment's content (and its "preview" then).
					comment.content = undefined
					comment.contentPreview = undefined
				}
			}
		}
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
	// Rename `thread.boardId` -> `thread.channelId`.
	thread.channelId = thread.boardId
	delete thread.boardId
	// Transform and censor thread title.
	if (thread.title) {
		thread.title = transformText(thread.title, {
			grammarCorrection,
			locale,
			replaceQuotes: true
		})
		if (censoredWords) {
			const titleCensored = censorWords(thread.title, censoredWords)
			if (titleCensored !== thread.title) {
				thread.titleCensoredContent = titleCensored
				thread.titleCensored = getInlineContentText(titleCensored)
			}
		}
	} else {
		// Normally, a thread will always have a title,
		// be it a title input by the thread creator,
		// or a one autogenerated from the original comment's
		// content, be it text, picture, video, etc.
		// But just in case anything weird happens,
		// a dummy thread title is added here.
		thread.title = `#${thread.id}`
	}
}

/** Set `post-link` ids. This is to identify them later
 * when restoring `VirtualScroller` state on scroll or
 * "Back" navigation so that those that were expanded
 * stay expanded.
 */
function setPostLinkProps(comment) {
	let i = 1
	visitPostParts('post-link', (postLink) => {
		// Set `post-link` ids. This is to identify them later
		// when restoring `VirtualScroller` state on scroll or
		// "Back" navigation so that those that were expanded
		// stay expanded.
		postLink._id = i
		i++
		// Rename: `boardId` -> `channelId`.
		postLink.channelId = postLink.boardId
		delete postLink.boardId
	}, comment.content)
}

/**
 * Removes leading `post-link` quote if it's quoting the "opening" post
 * of the thread. Only removes the first such OP quote, because sometimes
 * people intentionally quote OP post multiple times in a row in their
 * comment (for whatever reasons).
 * @param {(string|any[])} content — Comment content.
 * @param {object} thread — Thread info (thread id and channel id).
 * @return {(boolean|null)} [removed] — Returns `true` if a leading OP quote has been removed. Returns `null` if comment's content should be cleared.
 */
function removeLeadingOriginalPostQuote(content, thread) {
	if (content && Array.isArray(content)) {
		const firstBlock = content[0]
		if (Array.isArray(firstBlock)) {
			const firstInlineElement = firstBlock[0]
			if (firstInlineElement.type === 'post-link') {
				const postLink = firstInlineElement
				if (postLink.channelId === thread.channelId &&
						postLink.threadId === thread.id &&
						postLink.postId === thread.id) {
					if (Array.isArray(postLink.content) &&
						postLink.content[0].type === 'quote' &&
						postLink.content[0].generated) {
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
							// Remove the OP quote from the first paragraph of the comment.
							firstBlock.splice(0, 1)
							// Also remove any potential `<br/>`s or whitespace after such OP quote.
							trimInlineContent(firstBlock, 'left')
							if (firstBlock.length === 0) {
								// Remove the whole first paragraph if it's empty now.
								content.splice(0, 1)
							}
							return true
						}
					}
				}
			}
		}
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