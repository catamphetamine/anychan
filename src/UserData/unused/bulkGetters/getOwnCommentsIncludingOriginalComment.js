import getUserData from '../UserData.js'

// Combines thread ownership status and comment ownership statuses.
export default function getOwnCommentsIncludingOriginalComment(channelId, threadId) {
	const ownThreads = getUserData().getOwnThreads(channelId)
	const ownComments = getUserData().getOwnComments(channelId, threadId)
	if (ownThreads) {
		if (ownThreads.includes(threadId)) {
			return [threadId].concat(ownComments)
		}
	}
	return ownComments
}