import Imageboard from './Imageboard.js'

export default async function vote({
	dataSource,
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard(dataSource, { messages, http, userSettings }).vote({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}