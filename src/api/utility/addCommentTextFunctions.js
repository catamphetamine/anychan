import getCommentText from '../../utility/comment/getCommentText.js'
import getMessages from './getMessages.js'

export default function addCommentTextFunctions(comment, {
	messages
}) {
	// Returns a textual representation of `comment.content`.
	comment.getContentText = () => {
		if (typeof comment.contentText === 'string') {
			return comment.contentText
		}
		comment.parseContent()
		// `getCommentText()` can return `undefined`.
		comment.contentText = getCommentText(comment, {
			messages: getMessages(messages)
		}) || ''
		return comment.contentText
	}

	// Returns a textual representation of `comment.content`
	// converted to a single line.
	comment.getContentTextSingleLine = () => {
		if (typeof comment.contentTextSingleLine === 'string') {
			return comment.contentTextSingleLine
		}
		// `comment.getContentText()` can't return `undefined`.
		const text = (comment.title ? comment.title + '\n\n' : '') + comment.getContentText()
		comment.contentTextSingleLine = text.replace(/\n+/g, ' ')
		return comment.contentTextSingleLine
	}

	// Returns a textual representation of `comment.content`
	// converted to a single line and to lower case (for case-insensitive search).
	comment.getContentTextSingleLineLowerCase = () => {
		if (typeof comment.contentTextSingleLineLowerCase === 'string') {
			return comment.contentTextSingleLineLowerCase
		}
		comment.contentTextSingleLineLowerCase = comment.getContentTextSingleLine().toLowerCase()
		return comment.contentTextSingleLineLowerCase
	}
}