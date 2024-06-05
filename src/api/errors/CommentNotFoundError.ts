import type { ChannelId, ThreadId, CommentId } from "@/types"

export class CommentNotFoundError extends Error {
	constructor({
		channelId,
		threadId,
		commentId
	}: {
		channelId: ChannelId,
		threadId: ThreadId,
		commentId: CommentId
	}) {
		super('Comment not found')
	}
}