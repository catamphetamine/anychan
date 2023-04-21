import Imageboard from './Imageboard.js'

export default async function logOut({
	provider,
	http,
	messages,
	userSettings,
	channelId,
	threadId,
	commentId,
	...rest
}) {
	return await Imageboard({ provider, messages, http, userSettings }).logOut({
		boardId: channelId,
		threadId,
		commentId,
		...rest
	})
}