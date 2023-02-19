import getThreadThumbnail from '../thread/getThreadThumbnail.js'
import getLatestReadCommentIndex from '../thread/getLatestReadCommentIndex.js'

import {
	onStartLocked,
	onStartArchived,
	onStartExpired,
	onStartTrimming
} from './subscribedThreadRecordStatusUpdaters.js'

export default function createSubscribedThreadRecord(thread, { channel, userData }) {
	// const latestComment = thread.comments[thread.comments.length - 1]

	const subscribedThread = {
		id: thread.id,
		// The `#${thread.id}` part is just in case the thread
		// both doesn't have a title and a title wasn't autogenerated
		// for some reason (perhaps missing `messages` for "Picture", etc).
		title: thread.titleCensored,
		channel: {
			id: channel.id,
			title: channel.title
		}
	}

	// // Get new comments.
	// let latestReadCommentIndex = getLatestReadCommentIndex(thread)
	// if (latestReadCommentIndex === undefined) {
	// 	latestReadCommentIndex = -1
	// }
	// const newComments = thread.comments.slice(latestReadCommentIndex + 1)

	// // Set latest comments IDs.
	// subscribedThread.latestComments = newComments.map(_ => _.id)

	// // Set latest replies IDs.
	// const ownCommentIds = userData.getOwnComments(channel.id, thread.id) || []
	// const newReplies = newComments.filter((comment) => {
	// 	if (comment.inReplyTo) {
	// 		if (comment.inReplyTo.find(_ => ownCommentIds.includes(_.id))) {
	// 			return true
	// 		}
	// 	}
	// 	if (comment.inReplyToRemoved) {
	// 		if (comment.inReplyToRemoved.find(_ => ownCommentIds.includes(_))) {
	// 			return true
	// 		}
	// 	}
	// })
	// subscribedThread.latestReplies = newReplies.map(_ => _.id)

	// // Set latest comment info.
	// const latestCommentInfo = {
	// 	id: latestComment.id,
	// 	createdAt: latestComment.createdAt
	// }
	// if (!thread.trimming) {
	// 	// Could use `thread.comments.indexOf(latestComment)` here
	// 	// instead of `indexForLatestReadCommentDetection`.
	// 	latestCommentInfo.number = latestComment.indexForLatestReadCommentDetection + 1
	// }
	// subscribedThread.latestComment = latestCommentInfo

	// Set locked status.
	if (thread.locked) {
		onStartLocked(subscribedThread)
	}

	// Set archived status.
	if (thread.archived) {
		onStartArchived(subscribedThread, thread.archivedAt)
	}

	// Set expired status.
	if (thread.expired) {
		onStartExpired(subscribedThread)
	}

	// "Trimming" threads are threads in which older comments get erased
	// by newer once, hence there's no point in storing their `commentsCount`.
	if (thread.trimming) {
		onStartTrimming(subscribedThread)
	} else {
		// subscribedThread.commentsCount = thread.comments.length
	}

	// Set thumbnail.
	const thumbnail = getThreadThumbnail(thread)
	if (thumbnail) {
		subscribedThread.thumbnail = thumbnail
	}

	return subscribedThread
}