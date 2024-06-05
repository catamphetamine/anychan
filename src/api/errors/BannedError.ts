import type { ChannelId } from "@/types"

export class BannedError extends Error {
	banReason?: string
	banId?: string
	banChannelId?: ChannelId
	banEndsAt?: Date

	constructor({
		banReason,
		banId,
		banChannelId,
		banEndsAt
	}: {
		banReason?: string,
		banId?: string,
		banChannelId?: ChannelId,
		banEndsAt?: Date
	} = {}) {
		super('Banned')

		this.banReason = banReason
		this.banId = banId
		this.banChannelId = banChannelId
		this.banEndsAt = banEndsAt
	}
}