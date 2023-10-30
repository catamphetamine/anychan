export default class ThreadNotFoundError extends Error {
	constructor({ channelId, threadId }) {
		super('Thread not found')
	}
}