export default function getUrl(channelId, threadId, commentId) {
	if (threadId === undefined) {
		return `/${channelId}`
	}
	if (commentId === undefined || commentId === threadId) {
		return `/${channelId}/${threadId}`
	}
	return `/${channelId}/${threadId}#${commentId}`
}