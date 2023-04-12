import Imageboard from './Imageboard.js'

export default async function logIn({
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard({ messages, http, userSettings }).logIn({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}