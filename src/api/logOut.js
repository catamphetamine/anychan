export default async function logOut({
	channelId,
	threadId,
	commentId,
	http,
	userSettings,
	dataSource,
	...rest
}) {
	return await dataSource.api.logOut({
		channelId,
		threadId,
		commentId,
		http,
		userSettings,
		...rest
	})
}
