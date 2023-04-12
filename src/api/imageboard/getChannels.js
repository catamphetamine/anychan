import Imageboard from './Imageboard.js'

export default async function getChannelsFromImageboard({
	all,
	http,
	messages,
	userSettings
}) {
	const imageboard = Imageboard({ messages, http, userSettings })

	let channels = await (all ? imageboard.getAllBoards() : imageboard.getBoards())

	return {
		channels,
		hasMoreBoards: imageboard.hasMoreBoards()
	}
}