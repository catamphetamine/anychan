import getCommentUrlPattern from './getCommentUrlPattern.js'

export default function getCommentUrl(dataSource, { channelId, threadId, commentId, notSafeForWork }) {
	return getCommentUrlPattern(dataSource, { notSafeForWork })
		.replace('{channelId}', channelId)
		.replace('{threadId}', threadId)
		.replace('{commentId}', commentId)
}