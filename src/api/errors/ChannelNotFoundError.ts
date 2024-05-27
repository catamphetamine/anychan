import type { ChannelId } from "@/types"

export default class ChannelNotFoundError extends Error {
	channelId: ChannelId

	constructor(channelId: ChannelId) {
		super(`Channel not found: ${channelId}`)
		this.channelId = channelId
	}
}