export default async function voteForComment(imageboard, {
	channelId,
	...rest
}) {
	return await imageboard.voteForComment({
		boardId: channelId,
		...rest
	})
}