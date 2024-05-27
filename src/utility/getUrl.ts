import type { Channel, Thread, Comment } from '@/types'

export default function getUrl(channelId: Channel['id'], threadId?: Thread['id'], commentId?: Comment['id']) {
	if (threadId === undefined) {
		return `/${channelId}`
	}
	if (commentId === undefined || commentId === threadId) {
		return `/${channelId}/${threadId}`
	}
	return `/${channelId}/${threadId}#${commentId}`
}