import { shape, arrayOf, number, string, bool, object, any, oneOf, oneOfType, instanceOf } from 'prop-types'
import { id, date, postAttachment, postContent, censoredText } from 'webapp-frontend/src/PropTypes'

export const channelId = string

export const channel = shape({
	id: channelId.isRequired,
	title: string.isRequired
})

export const threadId = number

export const thread = shape({
	id: threadId.isRequired,
	channel: shape({
		id: channelId.isRequired,
		title: string
	}),
	title: string,
	titleCensored: string,
	createdAt: date,
	updatedAt: date,
	comments: arrayOf(comment).isRequired
})

export const commentId = number

export const comment = shape({
	id: commentId.isRequired,
	createdAt: date,
	authorName: string,
	authorEmail: string,
	authorRole: string,
	authorId: string,
	authorTripCode: string,
	title: string,
	titleCensored: censoredText,
	content: postContent,
	contentPreview: postContent,
	attachments: arrayOf(postAttachment),
	replies: arrayOf(object)
})

export const trackedThread = shape({
	id: threadId.isRequired,
	title: string.isRequired,
	addedAt: number.isRequired,
	channel: shape({
		id: channelId.isRequired
	}),
	thumbnail: shape({
		spoiler: bool,
		url: string.isRequired,
		type: string.isRequired,
		width: number.isRequired,
		height: number.isRequired
	}),
	expired: bool,
	// `expiredAt` has been added on Dec 9th, 2019.
	expiredAt: number,
	own: bool,
	newCommentsCount: number,
	newRepliesCount: number
})