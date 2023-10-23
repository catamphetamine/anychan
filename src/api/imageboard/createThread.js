import Imageboard from './Imageboard.js'

export default async function createThread({
	dataSource,
	http,
	messages,
	userSettings,
	channelId,
	...rest
}) {
	return await Imageboard(dataSource, { messages, http, userSettings }).createThread({
		boardId: channelId,
		...rest
	})
}