import Imageboard from './Imageboard.js'

export default async function getChannelsFromImageboard({
	dataSource,
	all,
	http,
	messages,
	userSettings
}) {
	const imageboard = Imageboard(dataSource, { messages, http, userSettings })

	let channels = await (all ? imageboard.getAllBoards() : imageboard.getBoards())

	return {
		channels,
		hasMoreBoards: imageboard.hasMoreBoards()
	}
}