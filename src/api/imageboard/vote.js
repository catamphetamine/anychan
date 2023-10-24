export default async function vote(imageboard, {
	channelId,
	...rest
}) {
	return await imageboard.vote({
		boardId: channelId,
		...rest
	})
}