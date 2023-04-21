import Imageboard from './Imageboard.js'

export default async function post({
	provider,
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard(provider, { messages, http, userSettings }).post({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}