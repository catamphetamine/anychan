import Imageboard from './Imageboard.js'

export default async function logIn({
	provider,
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard({ provider, messages, http, userSettings }).logIn({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}