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
export default function generateQuotes(content, {
	// `comment` is only used for generating post preview.
	comment,
	getCommentById,
	threadId,
	messages,
	// Is this function being called for the first time for this comment.
	isFirstRun,
	// `isParentCommentUpdate` is `true` in cases when this comment's update
	// was triggered by a "parent" comment update.
	isParentCommentUpdate
}) {
	let contentDidChange = true
	if (isParentCommentUpdate) {
		contentDidChange = false
	}
	if (isFirstRun || isParentCommentUpdate) {
		// Autogenerate "in reply to" quotes.
		if (setInReplyToQuotes(content, getCommentById, { threadId, messages })) {
			contentDidChange = true
		}
	}
	if (isFirstRun) {
		// Set "Deleted message" `content` for links to deleted comments.
		// Set "Hidden message" `content` for links to hidden comments.
		// Autogenerate "in reply to" quotes for links to all other comments.
		if (messages) {
			if (setPostLinksContent(content, { messages })) {
				contentDidChange = true
			}
		}
	}
	return contentDidChange
}