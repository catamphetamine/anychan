import Imageboard from './Imageboard.js'

export default async function getChannelsFromImageboard({
	provider,
	all,
	http,
	messages,
	userSettings
}) {
	const imageboard = Imageboard(provider, { messages, http, userSettings })

	let channels = await (all ? imageboard.getAllBoards() : imageboard.getBoards())

	return {
		channels,
		hasMoreBoards: imageboard.hasMoreBoards()
	}
}