export default class ChannelNotFoundError extends Error {
	constructor(channelId) {
		super(`Channel not found: ${channelId}`)
		this.channelId = channelId
	}
}