import Imageboard from './Imageboard.js'

export default async function logIn({
	dataSource,
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard({ dataSource, messages, http, userSettings }).logIn({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}