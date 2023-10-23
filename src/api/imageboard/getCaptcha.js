import Imageboard from './Imageboard.js'

export default async function getCaptcha({
	channelId,
	dataSource,
	userSettings,
	messages,
	http,
	...rest
}) {
	return await Imageboard(dataSource, { messages, http, userSettings }).getCaptcha({
		boardId: channelId,
		...rest
	})
}