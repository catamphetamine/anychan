import createCommentOrThread from './createCommentOrThread.js'

export default async function createThread(imageboard, {
	channelId,
	...rest
}) {
	return await createCommentOrThread(imageboard, {
		channelId,
		...rest
	})
}