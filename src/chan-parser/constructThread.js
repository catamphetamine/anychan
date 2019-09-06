import getPostSummary from 'webapp-frontend/src/utility/post/getPostSummary'
import getPostText from 'webapp-frontend/src/utility/post/getPostText'
import censorWords from 'webapp-frontend/src/utility/post/censorWords'

import createByIdIndex from './createByIdIndex'
import getInReplyToPostIds from './getInReplyToPostIds'
import setReplies from './setReplies'
import postProcessThreadCommentContent from './postProcessThreadCommentContent'

export default function constructThread(threadInfo, comments, {
	boardId,
	messages,
	censoredWords,
	commentLengthLimit,
	commentUrlRegExp,
	expandReplies,
	addOnContentChange
}) {
	const threadId = comments[0].id
	// On `8ch.net` "rolling" "sticky" threads are
	// also marked as `bumplimit: 1` when their
	// technical "bump limit" is technically "reached".
	// By definition, "rolling" and "sticky" threads don't expire.
	if (threadInfo.isSticky || threadInfo.isRolling) {
		if (threadInfo.isBumpLimitReached) {
			threadInfo.isBumpLimitReached = false
		}
	}
	// Set `.inReplyTo` array for each comment.
	// `.inReplyTo` array contains comment IDs.
	for (const comment of comments) {
		const inReplyTo = getInReplyToPostIds(comment, {
			boardId,
			threadId,
			commentUrlRegExp
		})
		if (inReplyTo) {
			comment.inReplyTo = inReplyTo
		}
	}
	// Set `.replies` array for each comment
	// based on the `.inReplyTo` array.
	// `.replies` array contains comment IDs.
	// Can only come after `.inReplyTo` arrays are set on comments.
	setReplies(comments)
	// `Array.find()` is slow for doing it every time.
	// A "get post by id" index is much faster.
	const getCommentById = createByIdIndex(comments)
	for (const comment of comments) {
		let isInitialCommentContentUpdate = true
		function updateContent(options) {
			const initial = isInitialCommentContentUpdate
			isInitialCommentContentUpdate = false
			// Set "Deleted message" for links to deleted comments.
			// Set "Hidden message" for links to hidden comments.
			// Autogenerate "in reply to" quotes for links to all other comments.
			return postProcessThreadCommentContent(comment.content, {
				// `comment` is only used for generating post preview.
				comment,
				commentLengthLimit,
				getCommentById,
				threadId,
				messages,
				initial,
				parentUpdate: options && options.parentUpdate
			})
		}
		if (comment.content) {
			updateContent()
		}
		if (addOnContentChange) {
			comment.onContentChange = (options) => {
				if (comment.content) {
					if (updateContent(options)) {
						if (options && options.onContentChange) {
							options.onContentChange()
						}
					}
				}
				// Don't recurse into updating replies for potentially less CPU usage.
				// Sometimes replies depend on parent's parent reply content.
				// For example, if comment #1 is "Text" and comment #2 is ">>1"
				// and comment #3 is ">>2" then when comment #1 `content` is paresed
				// then only comment #2 `content` is updated to "> Text" and
				// comment #3 `content` is not updated in this case and will
				// just be a "Message" link. The solution is: don't post comments
				// without the actual content.
				if (!(options && options.parentUpdate)) {
					const changedReplyIds = []
					if (comment.replies && expandReplies) {
						for (const reply of comment.replies) {
							if (reply.content) {
								reply.onContentChange({
									parentUpdate: true,
									onContentChange() {
										changedReplyIds.push(reply.id)
									}
								})
							}
						}
					}
					return changedReplyIds
				}
			}
		}
	}
	if (expandReplies) {
		// Expand `replies` array from a list of reply `id`s to a list of the reply objects.
		for (const comment of comments) {
			if (comment.replies) {
				comment.replies = comment.replies.map(getCommentById)
			}
		}
	}
	if (!threadInfo.title) {
		threadInfo.title = getPostTitle(comments[0], { messages })
		if (threadInfo.title) {
			if (censoredWords) {
				const titleCensored = censorWords(threadInfo.title, censoredWords)
				if (titleCensored !== threadInfo.title) {
					threadInfo.titleCensored = getPostText(titleCensored)
				}
			}
		}
	}
	return {
		...threadInfo,
		id: threadId,
		comments
	}
}

function getPostTitle(post, { messages }) {
	if (post.title) {
		return post.title
	}
	const summary = getPostSummary(post.content, post.attachments, {
		messages: messages.contentType,
		maxLength: 60,
		stopOnNewLine: true
	})
	if (summary) {
		return summary
	}
	// Thread title is guaranteed to be non-empty.
	return `#${post.id}`
}