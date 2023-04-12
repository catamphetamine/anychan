import { getProvider } from '../provider.js'

export default async function report({
	channelId,
	threadId,
	commentId,
	http,
	userSettings,
	...rest
}) {
	return await getProvider().api.report({
		channelId,
		threadId,
		commentId,
		http,
		userSettings,
		...rest
	})
}
