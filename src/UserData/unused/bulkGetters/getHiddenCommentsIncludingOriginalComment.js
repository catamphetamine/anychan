import getUserData from '../UserData.js'

// Combines thread "hidden" status and comment "hidden" statuses.
export default function getHiddenCommentsIncludingOriginalComment(channelId, threadId) {
	const hiddenThreads = getUserData().getHiddenThreads(channelId)
	const hiddenComments = getUserData().getHiddenComments(channelId, threadId)
	if (hiddenThreads) {
		if (hiddenThreads.includes(threadId)) {
			return [threadId].concat(hiddenComments)
		}
	}
	return hiddenComments
}