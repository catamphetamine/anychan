import Imageboard from './Imageboard.js'

export default async function report({
	dataSource,
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard(dataSource, { messages, http, userSettings }).report({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}