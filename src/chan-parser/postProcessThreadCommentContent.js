import generatePostPreview from 'webapp-frontend/src/utility/post/generatePostPreview'

import setInReplyToQuotes from './setInReplyToQuotes'
import setPostLinksContent from './setPostLinksContent'

/**
 * Sets "Deleted message" `content` for links to deleted comments.
 * Sets "Hidden message" `content` for links to hidden comments.
 * Autogenerates "in reply to" quotes for links to all other comments.
 * @param  {any} content — Comment content.
 * @param  {function} getCommentById
 * @param  {object} options — `{ threadId, messages }`.
 */
export default function postProcessThreadCommentContent(content, {
	// `comment` is only used for generating post preview.
	comment,
	commentLengthLimit,
	getCommentById,
	threadId,
	messages,
	initial,
	parentUpdate
}) {
	if (initial || parentUpdate) {
		// Autogenerate "in reply to" quotes.
		setInReplyToQuotes(content, getCommentById, { threadId, messages })
	}
	if (initial) {
		// Set "Deleted message" `content` for links to deleted comments.
		// Set "Hidden message" `content` for links to hidden comments.
		// Autogenerate "in reply to" quotes for links to all other comments.
		if (messages) {
			setPostLinksContent(content, { messages })
		}
	}
	// Generate preview for long comments.
	// (must come after `setInReplyToQuotes()`
	//  which is called inside `postProcessComments()`)
	if (commentLengthLimit) {
		const preview = generatePostPreview(content, comment.attachments, { limit: commentLengthLimit })
		if (preview) {
			comment.contentPreview = preview
		}
	}
}