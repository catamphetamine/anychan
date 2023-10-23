export default class BannedError extends Error {
	constructor({
		banReason,
		banId,
		banChannelId,
		banEndsAt
	} = {}) {
		super('Banned')

		this.banReason = banReason
		this.banId = banId
		this.banChannelId = banChannelId
		this.banEndsAt = banEndsAt
	}
}