import createCommentOrThread from './createCommentOrThread.js'

export default async function createComment(imageboard, {
	channelId,
	...rest
}) {
	return await createCommentOrThread(imageboard, {
		channelId,
		...rest
	})
}