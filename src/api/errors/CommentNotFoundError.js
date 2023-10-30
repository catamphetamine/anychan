export default class CommentNotFoundError extends Error {
	constructor({ channelId, threadId, commentId }) {
		super('Comment not found')
	}
}