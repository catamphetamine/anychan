import { getProvider } from '../provider.js'

export default async function vote({
	channelId,
	threadId,
	commentId,
	http,
	userSettings,
	...rest
}) {
	return await getProvider().api.vote({
		channelId,
		threadId,
		commentId,
		http,
		userSettings,
		...rest
	})
}
