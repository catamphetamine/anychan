import Imageboard from './Imageboard.js'

export default async function report({
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard({ messages, http, userSettings }).report({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}