export default async function logIn({
	channelId,
	threadId,
	commentId,
	http,
	userSettings,
	dataSource,
	...rest
}) {
	return await dataSource.api.logIn({
		channelId,
		threadId,
		commentId,
		http,
		userSettings,
		...rest
	})
}
