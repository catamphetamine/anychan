import Imageboard from './Imageboard.js'

export default async function post({
	dataSource,
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard(dataSource, { messages, http, userSettings }).post({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}