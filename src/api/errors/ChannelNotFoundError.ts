import type { ChannelId } from "@/types"

export class ChannelNotFoundError extends Error {
	status: 404

	channelId: ChannelId

	constructor({ channelId }: { channelId: ChannelId }) {
		super(`Channel not found: ${channelId}`)

		// `status: 404` property is used in this application to detect "not found" type of errors
		// in order to potentially handle those in a certain way.
		this.status = 404

		this.channelId = channelId
	}
}