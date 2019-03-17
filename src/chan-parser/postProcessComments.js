import setInReplyToPosts from './setInReplyToPosts'
import setInReplyToQuotes from './setInReplyToQuotes'
import setPostLinksContent from './setPostLinksContent'
import setReplies from './setReplies'

import generatePostPreview from 'webapp-frontend/src/utility/post/generatePostPreview'

export default function postProcessComments(comments, {
	threadId,
	commentLengthLimit,
	messages
}) {
	// Autogenerate "in reply to" quotes.
	// Set `post-link`s' text.
	for (const comment of comments) {
		setInReplyToPosts(comment)
		setInReplyToQuotes(comment.content, comments, { threadId, messages })
		setPostLinksContent(comment, { messages })
		// Generate preview for long comments.
		// (must come after `setInReplyToQuotes`)
		if (comment.content) {
			if (commentLengthLimit) {
				const preview = generatePostPreview(comment, { limit: commentLengthLimit })
				if (preview) {
					comment.contentPreview = preview
				}
			}
		}
	}
	// Set `.replies` array for each comment.
	// `.replies` array has other comment IDs.
	setReplies(comments)
}