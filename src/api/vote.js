export default async function vote({
	channelId,
	threadId,
	commentId,
	http,
	userSettings,
	dataSource,
	...rest
}) {
	return await dataSource.api.vote({
		channelId,
		threadId,
		commentId,
		http,
		userSettings,
		...rest
	})
}
