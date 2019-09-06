import { shape, arrayOf, number, string, bool, object, any, oneOf, oneOfType, instanceOf } from 'prop-types'
import { id, date, postAttachment, postContent, censoredText } from 'webapp-frontend/src/PropTypes'

export const board = shape({
	id: string.isRequired,
	title: string.isRequired
})

export const thread = shape({
	id: string.isRequired,
	board: shape({
		id: number.isRequired,
		title: string
	}),
	title: string,
	titleCensored: string,
	comments: arrayOf(comment).isRequired
})

export const comment = shape({
	id: number.isRequired,
	createdAt: date.isRequired,
	authorName: string,
	authorEmail: string,
	authorRole: string,
	authorId: string,
	tripCode: string,
	title: string,
	titleCensored: censoredText,
	content: postContent,
	contentPreview: postContent,
	attachments: arrayOf(postAttachment),
	replies: arrayOf(object)
})

export const trackedThread = shape({
	id: number.isRequired,
	title: string.isRequired,
	board: shape({
		id: string.isRequired
	}),
	thumbnail: shape({
		spoiler: bool,
		url: string.isRequired,
		type: string.isRequired,
		width: number.isRequired,
		height: number.isRequired
	}),
	expired: bool,
	newCommentsCount: number,
	newRepliesCount: number
})