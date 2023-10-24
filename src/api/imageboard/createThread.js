export default async function createThread(imageboard, {
	channelId,
	...rest
}) {
	return await imageboard.createThread({
		boardId: channelId,
		...rest
	})
}