import type { ChannelId } from '@/types'

export default function getChannelUrl(channelId: ChannelId) {
	return `/${channelId}`
}