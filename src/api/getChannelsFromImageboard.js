import Imageboard from './Imageboard.js'

export default async function getChannelsFromImageboard({
	all,
	http,
	proxyUrl
}) {
	const imageboard = Imageboard({ http, proxyUrl })

	let channels = await (all ? imageboard.getAllBoards() : imageboard.getBoards())

	return {
		channels,
		hasMoreBoards: imageboard.hasMoreBoards()
	}
}