import { getProvider } from '../provider.js'

export default async function logOut({
	channelId,
	threadId,
	commentId,
	http,
	userSettings,
	...rest
}) {
	return await getProvider().api.logOut({
		channelId,
		threadId,
		commentId,
		http,
		userSettings,
		...rest
	})
}
