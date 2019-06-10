import getInReplyToPostIds from './getInReplyToPostIds'
import setReplies from './setReplies'
import postProcessThreadCommentsContent from './postProcessThreadCommentsContent'

import generatePostPreview from 'webapp-frontend/src/utility/post/generatePostPreview'

export default function constructThread(threadInfo, comments, {
	boardId,
	messages,
	commentLengthLimit,
	commentUrlRegExp
}) {
	const threadId = comments[0].id
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
	// Set "Deleted message" for links to deleted comments.
	// Set "Hidden message" for links to hidden comments.
	// Autogenerate "in reply to" quotes for links to all other comments.
	postProcessThreadCommentsContent(comments, {
		threadId,
		messages
	})
	// Generate preview for long comments.
	// (must come after `setInReplyToQuotes()`
	//  which is called inside `postProcessComments()`)
	if (commentLengthLimit) {
		for (const comment of comments) {
			if (comment.content) {
				const preview = generatePostPreview(comment, { limit: commentLengthLimit })
				if (preview) {
					comment.contentPreview = preview
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