import Imageboard from './Imageboard.js'

export default async function logOut({
	dataSource,
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard({ dataSource, messages, http, userSettings }).logOut({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}