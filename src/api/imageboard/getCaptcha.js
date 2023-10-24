export default async function getCaptcha(imageboard, {
	channelId,
	...rest
}) {
	return await imageboard.getCaptcha({
		boardId: channelId,
		...rest
	})
}