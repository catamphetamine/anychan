import type { ChannelId, ThreadId } from "@/types"

export class ThreadNotFoundError extends Error {
	status: 404

	channelId: ChannelId
	threadId: ThreadId

	constructor({
		channelId,
		threadId
	}: {
		channelId: ChannelId,
		threadId: ThreadId
	}) {
		super('Thread not found')

		// `status: 404` property is used in this application to detect "not found" type of errors
		// in order to potentially handle those in a certain way.
		// For example, it tells the application that the thread has potentially expired.
		this.status = 404

		this.channelId = channelId
		this.threadId = threadId
	}
}