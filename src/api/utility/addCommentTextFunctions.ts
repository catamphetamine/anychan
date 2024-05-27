import type { Comment, Messages } from '../../types/index.js'

import getCommentText from '../../utility/comment/getCommentText.js'
import getMessages from './getMessagesForImageboard.js'

export default function addCommentTextFunctions(comment: Comment, {
	messages
}: {
	messages: Messages
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
		comment.contentTextSingleLine = getContentTextSingleLine_(comment)
		return comment.contentTextSingleLine
	}

	// Returns a textual representation of `comment.content`
	// converted to a single line and to lower case (for case-insensitive search).
	comment.getContentTextSingleLineLowerCase = () => {
		if (typeof comment.contentTextSingleLineLowerCase === 'string') {
			return comment.contentTextSingleLineLowerCase
		}
		comment.contentTextSingleLineLowerCase = getContentTextSingleLine_(comment).toLowerCase()
		return comment.contentTextSingleLineLowerCase
	}

	// Returns a textual representation of `comment.content` (with `title`)
	// converted to a single line and to lower case (for case-insensitive search).
	comment.getContentTextWithTitleSingleLineLowerCase = () => {
		if (typeof comment.contentTextWithTitleSingleLineLowerCase === 'string') {
			return comment.contentTextWithTitleSingleLineLowerCase
		}
		comment.contentTextWithTitleSingleLineLowerCase = getContentTextSingleLineWithTitle_(comment).toLowerCase()
		return comment.contentTextWithTitleSingleLineLowerCase
	}
}

// Returns a `string`.
function getContentTextSingleLine_(comment: Comment) {
	return comment.getContentText().replace(/\n+/g, ' ↩ ')
}

// Returns a `string`.
function getContentTextSingleLineWithTitle_(comment: Comment) {
	const contentTextSingleLine = getContentTextSingleLine_(comment)
	const { title = '' } = comment
	if (title && contentTextSingleLine) {
		return title + ' ' + contentTextSingleLine
	}
	return title || contentTextSingleLine
}