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
 * @return {boolean} [contentDidChange] — Returns `true` if `content` has been changed as a result.
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
	let contentDidChange = true
	if (parentUpdate) {
		contentDidChange = false
	}
	if (initial || parentUpdate) {
		// Autogenerate "in reply to" quotes.
		if (setInReplyToQuotes(content, getCommentById, { threadId, messages })) {
			contentDidChange = true
		}
	}
	if (initial) {
		// Set "Deleted message" `content` for links to deleted comments.
		// Set "Hidden message" `content` for links to hidden comments.
		// Autogenerate "in reply to" quotes for links to all other comments.
		if (messages) {
			if (setPostLinksContent(content, { messages })) {
				contentDidChange = true
			}
		}
	}
	// Generate preview for long comments.
	// (must come after `setInReplyToQuotes()`
	//  which is called inside `postProcessComments()`)
	if (commentLengthLimit && contentDidChange) {
		const preview = generatePostPreview(content, comment.attachments, { limit: commentLengthLimit })
		if (preview) {
			comment.contentPreview = preview
		}
	}
	return contentDidChange
}