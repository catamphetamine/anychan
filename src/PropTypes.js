import PropTypes from 'prop-types'

import {
	date
} from 'frontend-lib/components/PropTypes.js'

import {
	postAttachment,
	postContent,
	censoredText,
	picture
} from 'social-components-react/components/PropTypes.js'

import {
	shape,
	arrayOf,
	objectOf,
	number,
	string,
	bool,
	object,
	any,
	oneOf,
	oneOfType,
	instanceOf
} from 'prop-types'

export const channelId = string

export const channel = shape({
	id: channelId.isRequired,
	title: string.isRequired,
	picture: picture
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

export const subscribedThread = shape({
	id: threadId.isRequired,
	title: string.isRequired,
	addedAt: instanceOf(Date).isRequired,
	updatedAt: instanceOf(Date),
	channel: shape({
		id: channelId.isRequired,
		title: string
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
	expiredAt: instanceOf(Date),
	// `archived` and `archivedAt` have been added in July 2021.
	archived: bool,
	archivedAt: instanceOf(Date),
	// // `commentsCount` has been added in July 2021.
	// // `commentsCount` is not set for "trimming" threads.
	// // `commentsCount` has been removed in August 2022.
	// commentsCount: number,
	// `locked` and `lockedAt` have been added in July 2021.
	locked: bool,
	lockedAt: instanceOf(Date),
	// `trimming` has been added in July 2021.
	trimming: bool,
	// newCommentsCount: number,
	// newRepliesCount: number,
	// `latestReplies` and `latestComments` have been added in July 2021.
	// `latestReplies` and `latestComments` have been removed in August 2022.
	// latestReplies: arrayOf(number).isRequired,
	// latestComments: arrayOf(number).isRequired,
	// `latestComment` has been removed in August 2022.
	// latestComment: shape({
	// 	id: commentId.isRequired,
	// 	// `number` is not set for "trimming" threads.
	// 	number: number,
	// 	createdAt: instanceOf(Date).isRequired
	// }).isRequired
})

export const dataSource = shape({
	id: string.isRequired,
	shortId: string.isRequired,
	title: string.isRequired,
	subtitle: string,
	description: postContent.isRequired,
	links: arrayOf(shape({
		type: string,
		text: string.isRequired,
		url: string.isRequired
	})),
	logo: oneOfType([
		string,
		PropTypes.elementType
	]),
	contentCategories: arrayOf(string),
	contentCategoryUnspecified: string,
	domains: arrayOf(string),
	domain: string.isRequired,
	errorPages: objectOf(objectOf(arrayOf(string))),
	threadArchive: bool,
	threadArchiveLifetime: number,
	footnotes: postContent,
	imageboard: string,
	channelUrl: string.isRequired,
	threadUrl: string.isRequired,
	commentUrl: string.isRequired,
	getAbsoluteUrl: PropTypes.func,
	api: shape({
		getChannels: PropTypes.func.isRequired,
		findChannels: PropTypes.func,
		getThreads: PropTypes.func.isRequired,
		findThreads: PropTypes.func,
		supportsGlobalThreadSearch: bool,
		getThread: PropTypes.func.isRequired,
		getThreadComments: PropTypes.func,
		vote: PropTypes.func
	})
})

// See `easy-react-form` docs.
const replyFormState = shape({
	values: object,
	errors: object
	// ...
})

export const commentTreeState = shape({
	hidden: bool,
	expandContent: bool,
	expandPostLinkQuotes: objectOf(bool),
	showReplyForm: bool,
	replyForm: replyFormState,
	replyFormInputHeight: number,
	replyFormInputError: string,
	replyFormError: string
})

export const user = shape({

})