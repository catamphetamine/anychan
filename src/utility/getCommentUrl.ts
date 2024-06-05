import type { ChannelId, ThreadId, CommentId } from '@/types'

export default function getCommentUrl(channelId: ChannelId, threadId: ThreadId, commentId: CommentId) {
	if (commentId === threadId) {
		return `/${channelId}/${threadId}`
	}
	return `/${channelId}/${threadId}#${commentId}`
}