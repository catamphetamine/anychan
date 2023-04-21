import Imageboard from './Imageboard.js'

export default async function vote({
	provider,
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard(provider, { messages, http, userSettings }).vote({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}