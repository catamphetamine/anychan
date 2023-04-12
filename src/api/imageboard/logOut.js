import Imageboard from './Imageboard.js'

export default async function logOut({
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard({ messages, http, userSettings }).logOut({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}