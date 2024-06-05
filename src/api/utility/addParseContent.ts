import type { Channel, ChannelLayout, Thread, Comment, InlineElementPostLinkWithId, UserSettingsJson, DataSource, PostLink, Mode } from '../../types/index.js'
import type { InlineElementWithType, InlineElementPostLink, InlineElementEmoji } from 'social-components'

import {
	generatePostPreview
 } from 'social-components/post'

 import {
	censorWords,
	transformContent,
	visitContentParts,
	trimInlineContent
 } from 'social-components/content'

import transformText from './transformText.js'
import getCommentLengthLimit from '../../utility/comment/getCommentLengthLimit.js'
import setEmbeddedAttachmentsProps from '../../utility/post/setEmbeddedAttachmentsProps.js'
import shouldMinimizeGeneratedPostLinkBlockQuotes from '../../utility/post/shouldMinimizeGeneratedPostLinkBlockQuotes.js'
// import { loadResourceLinksSync } from '../../utility/loadResourceLinks.js'

import transformDataSourceLink from '../../utility/transformDataSourceLink.js'
import getUrlAtDataSourceDomain from '../../utility/dataSource/getUrlAtDataSourceDomain.js'

// Content preview:
// * Content preview is used on channel page when showing a thread.
//   In that case, `maxLength` is equal to `configuration.commentLengthLimitForThreadPreview`.
// * Content preview is used on channel page (using tile layout) when showing a thread.
//   In that case, `maxLength` is equal to `configuration.commentLengthLimitForThreadPreviewForTileLayout`.
// * Content preview is used on thread page when showing a comment.
//   In that case, `maxLength` is equal to `configuration.commentLengthLimit`.

interface Parameters {
	mode: Mode;
	channelLayout: ChannelLayout;
	channelId: Channel['id'];
	threadId: Thread['id'];
	grammarCorrection: UserSettingsJson['grammarCorrection'];
	censoredWords: UserSettingsJson['censoredWords'];
	locale: UserSettingsJson['locale'];
	dataSource: DataSource,
	// messages
}

/**
 * Modifies the `comment`'s `.parseContent()` function a bit.
 *
 * It "mutates" the `comment` object rather than creating a new copy of it.
 * That behavior is intentional: because `getCommentById()` function is created initially
 * and then not updated, all references to all `comment` objects should stay the same
 * throughout the whole lifecycle of a thread.
 *
 * @param {Comment} comment
 * @param {string} mode — Either "channel" or "thread".
 * @param {string} channelId
 * @param {number} threadId
 * @param {boolean} [options.grammarCorrection]
 * @param {WordFilter[]} [options.censoredWords] — See `social-components`'s `censorWords()` for more info.
 * @param {string} options.locale
 */
export default function addParseContent(comment: Partial<Comment>, {
	mode,
	channelLayout,
	channelId,
	threadId,
	grammarCorrection,
	censoredWords,
	locale,
	dataSource,
	// messages
}: Parameters) {
	const originalParseContent = comment.parseContent

	// Modify the `comment.parseContent()` function that is created by `imageboard` package:
	// it will call the original `comment.parseContent()` and it will also additionally do some modifications on top:
	// * Censors "offensive" words.
	// * Corrects grammar (commas and spaces, long dashes, quotes, etc).
	// * Fixes `kohlchan.net` emoji URLs.
	// * Aligns attachments that're embedded in comment content to the left side because by default they're centered.
	// * Sets utility properties `channelId`/`threadId` on `post-link`s.
	// * Removes "OP" quote at the start of comment content.
	comment.parseContent = ({
		getCommentById
	}: {
		getCommentById?: (id: Comment['id']) => Comment
	} = {}) => {
		// Thread page "auto-update" feature:
		//
		// * Replaces `thread` object on every refresh.
		//   That's just to trigger a re-render of the thread page
		//
		// * Replaces `comment` objects when those get new replies.
		//   That's just to trigger a re-render of the relevant comment elements
		//   to update their replies count number, and, in case their replies are
		//   currently expanded, to re-render the tree of their replies.
		//
		// So the `comment` object reference might change in some future.
		// Hence the use of a custom `getCommentById()` parameter function.
		//
		// Since the `comment` object reference inside `thread.comments` list
		// might have changed during a recent thread auto-update, get the latest
		// `comment` object reference first.
		//
		if (getCommentById) {
			comment = getCommentById(comment.id)
		}

		// `.hasContentBeenParsed()` function is provided by the `imageboard` library.
		// It will return `true` if the comment's content has been parsed.
		if (comment.hasContentBeenParsed()) {
			return
		}

		originalParseContent({ getCommentById })

		// Only on `kohlchan.net`:
		// Convert relative URLs to "emojis" to absolute ones
		// in case of not running on an imageboard's "official" domain.
		// (for example, when running on the `anychan` demo website)
		if (dataSource.id === 'kohlchan') {
			if (comment.content) {
				visitContentParts('emoji', (emoji: InlineElementEmoji) => {
					if (emoji.url) {
						emoji.url = getUrlAtDataSourceDomain(emoji.url, { dataSource })
					}
				}, comment.content)
			}
		}

		// Transform comment content:
		// * Censor "offensive" words.
		// * Correct grammar (commas and spaces, long dashes, quotes, etc).
		if (comment.content) {
			const _transformContent = (content: Comment['content']) => {
				let unpairedQuoteEncountered: boolean
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
							return censorWords(part, censoredWords)
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
					// Transform `link`s having the same `service` as the current data source
					// from external hyperlinks to internal application links.
					// For example, if the application uses `4chan` as a data source
					// and then encounters a link to `4chan.org` then it would transform that link
					// from an external "absolute URL" hyperlink to an in-app link.
					if (part.type === 'link') {
						if (part.service === dataSource.id) {
							const { url, content } = transformDataSourceLink({
								url: part.url,
								content: part.content
							}, {
								dataSource
							})
							part.url = url
							part.content = content
						}
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

		// Align attachments that're embedded in comment content to the left side because by default they're centered.
		setEmbeddedAttachmentsProps(comment)

		// Set `channelId`/`threadId` on `post-link`s.
		// That info can be used when viewing a list of comments in a thread:
		// when a user clicks a link to a comment from the same thread,
		// there'd be no need to navigate to another page and the user
		// could just be scrolled to the relevant comment, or something like that.
		if (mode === 'thread') {
			setPostLinkProps(comment.content)
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
			const result = removeLeadingOriginalPostQuote(comment.content, {
				channelId,
				threadId
			})
			if (result) {
				// If removed a leading OP quote from the comment's content,
				// then re-generate the preview (if it existed before).
				if (comment.contentPreview) {
					const preview = generatePostPreview(comment, {
						maxLength: getCommentLengthLimit({ mode, channelLayout }),
						minimizeGeneratedPostLinkBlockQuotes: shouldMinimizeGeneratedPostLinkBlockQuotes()
					})
					// `preview` won't be a `string`: `imageboard` parses all comments
					// by default since no `parseContent: false` has been passed to it.
					comment.contentPreview = preview as Comment['content']
				}
			} else if (result === null) {
				// If after removing an "OP" quote at the start of comment content
				// it becomes empty content then remove `comment.content` property:
				// it just would mean that the comment's content was just an "OP" quote.
				comment.content = undefined
				comment.contentPreview = undefined
			}
		}
	}
}

/** Set `post-link` ids. This is to identify them later
 * when restoring `VirtualScroller` state on scroll or
 * "Back" navigation so that those that were expanded
 * stay expanded.
 */
function setPostLinkProps(content: Comment['content']) {
	let i = 1
	visitContentParts('post-link', (contentPart) => {
		const postLink = contentPart as InlineElementPostLink

		// Set `post-link` ids. This is to identify them later
		// when restoring `VirtualScroller` state on scroll or
		// "Back" navigation so that those that were expanded
		// stay expanded.
		(postLink as InlineElementPostLinkWithId)._id = i
		i++

		// `imageboard` package sets `postLink.meta.boardId` property on `post-link`s.
		// Rename `postLink.meta.boardId` to `postLink.meta.channelId`.
		if (postLink.meta && postLink.meta.boardId) {
			postLink.meta.channelId = postLink.meta.boardId
			delete postLink.meta.boardId
		}

		// `imageboard` package sets `postLink.meta.postId` property on `post-link`s.
		// Rename `postLink.meta.postId` to `postLink.meta.commentId`.
		if (postLink.meta && postLink.meta.postId) {
			postLink.meta.commentId = postLink.meta.postId
			delete postLink.meta.postId
		}
	}, content)
}

/**
 * Removes leading `post-link` quote if it's quoting the "opening" post
 * of the thread. Only removes the first such OP quote, because sometimes
 * people intentionally quote OP post multiple times in a row in their
 * comment (for whatever reasons).
 * @param {(string|any[])} content — Comment content.
 * @param {string} channelId
 * @param {number} threadId
 * @return {(boolean|null)} [removed] — Returns `true` if a leading OP quote has been removed. Returns `null` if comment's content should be cleared.
 */
function removeLeadingOriginalPostQuote(content: Comment['content'], {
	channelId,
	threadId
}: {
	channelId: Channel['id'],
	threadId: Thread['id']
}) {
	if (content && Array.isArray(content)) {
		const firstBlock = content[0]
		if (Array.isArray(firstBlock)) {
			const firstInlineElement = firstBlock[0]
			if (isInlineElementPostLink(firstInlineElement as Partial<InlineElementWithType>)) {
				const postLink = firstInlineElement as PostLink
				if (
					postLink.meta &&
					postLink.meta.channelId === channelId &&
					postLink.meta.threadId === threadId &&
					postLink.meta.commentId === threadId
				) {
					if (Array.isArray(postLink.content)) {
						if (isGeneratedQuote(postLink.content[0] as Partial<InlineElementWithType>)) {
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
								// Also remove any potential `<br/>`s or whitespace after such OP quote
								// and before the first block of the content that follows it.
								trimInlineContent(firstBlock, {
									right: false
								})
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
}

function isInlineElementPostLink(element: Partial<InlineElementWithType>): element is InlineElementPostLink {
	return element.type === 'post-link'
}

function isGeneratedQuote(contentBlock: Partial<InlineElementWithType> & { contentGenerated?: boolean }) {
	return contentBlock.type === 'quote' && contentBlock.contentGenerated
}