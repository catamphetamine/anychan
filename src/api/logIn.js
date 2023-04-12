import { getProvider } from '../provider.js'

export default async function logIn({
	channelId,
	threadId,
	commentId,
	http,
	userSettings,
	...rest
}) {
	return await getProvider().api.logIn({
		channelId,
		threadId,
		commentId,
		http,
		userSettings,
		...rest
	})
}
