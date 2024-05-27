import type { ChannelId, ThreadId } from "@/types"

export default class ThreadNotFoundError extends Error {
	constructor({
		channelId,
		threadId
	}: {
		channelId: ChannelId,
		threadId: ThreadId
	}) {
		super('Thread not found')
	}
}