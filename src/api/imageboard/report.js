export default async function report(imageboard, {
	channelId,
	...rest
}) {
	return await imageboard.report({
		boardId: channelId,
		...rest
	})
}