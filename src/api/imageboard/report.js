import Imageboard from './Imageboard.js'

export default async function report({
	provider,
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard(provider, { messages, http, userSettings }).report({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}