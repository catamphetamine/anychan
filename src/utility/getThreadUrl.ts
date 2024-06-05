import type { ChannelId, ThreadId } from '@/types'

export default function getThreadUrl(channelId: ChannelId, threadId: ThreadId) {
	return `/${channelId}/${threadId}`
}