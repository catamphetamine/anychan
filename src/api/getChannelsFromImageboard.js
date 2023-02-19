import Imageboard from './Imageboard.js'

export default async function getChannelsFromImageboard({
	all,
	http,
	proxyUrl,
	userSettings
}) {
	const imageboard = Imageboard({ http, proxyUrl, userSettings })

	let channels = await (all ? imageboard.getAllBoards() : imageboard.getBoards())

	return {
		channels,
		hasMoreBoards: imageboard.hasMoreBoards()
	}
}