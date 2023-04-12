import { getProvider } from '../provider.js'

export default async function post({
	channelId,
	threadId,
	commentId,
	http,
	userSettings,
	...rest
}) {
	return await getProvider().api.post({
		channelId,
		threadId,
		commentId,
		http,
		userSettings,
		...rest
	})
}
