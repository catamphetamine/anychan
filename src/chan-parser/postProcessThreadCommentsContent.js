import setInReplyToQuotes from './setInReplyToQuotes'
import setPostLinksContent from './setPostLinksContent'
import createByIdIndex from './createByIdIndex'

/**
 * Sets "Deleted message" `content` for links to deleted comments.
 * Sets "Hidden message" `content` for links to hidden comments.
 * Autogenerates "in reply to" quotes for links to all other comments.
 * @param  {object[]} comments
 * @param  {object} options — `{ threadId, messages }`.
 */
export default function postProcessThreadCommentsContent(comments, {
	threadId,
	messages
}) {
	// `Array.find()` is slow for doing it every time.
	// A "get post by id" index is much faster.
	const getPostById = createByIdIndex(comments)
	for (const comment of comments) {
		if (comment.content) {
			// Autogenerate "in reply to" quotes.
			setInReplyToQuotes(comment.content, comments, { threadId, messages, getPostById })
			// Set "Deleted message" `content` for links to deleted comments.
			// Set "Hidden message" `content` for links to hidden comments.
			// Autogenerate "in reply to" quotes for links to all other comments.
			if (messages) {
				setPostLinksContent(comment.content, { messages })
			}
		}
	}
}