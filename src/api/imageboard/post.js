import Imageboard from './Imageboard.js'

export default async function post({
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard({ messages, http, userSettings }).post({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}