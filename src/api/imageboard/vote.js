import Imageboard from './Imageboard.js'

export default async function vote({
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard({ messages, http, userSettings }).vote({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}