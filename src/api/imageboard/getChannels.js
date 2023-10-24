export default async function getChannelsFromImageboard(imageboard, {
	all
}) {
	let channels = await (all ? imageboard.getAllBoards() : imageboard.getBoards())

	return {
		channels,
		hasMoreBoards: imageboard.hasMoreBoards()
	}
}