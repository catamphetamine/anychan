import Imageboard from './Imageboard.js'
import { getProvider } from '../provider.js'

export default async function vote({
	http,
	up,
	channelId,
	threadId,
	commentId,
	proxyUrl,
	userSettings
}) {
	const provider = getProvider()
	if (provider.imageboard) {
		return await Imageboard({ http, proxyUrl, userSettings }).vote({
			boardId: channelId,
			threadId,
			commentId,
			up
		})
	} else {
		return await provider.api.vote({
			channelId,
			threadId,
			commentId,
			up
		})
	}
}
