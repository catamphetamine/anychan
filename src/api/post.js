export default async function post({
	channelId,
	threadId,
	commentId,
	http,
	userSettings,
	dataSource,
	...rest
}) {
	return await dataSource.api.post({
		channelId,
		threadId,
		commentId,
		http,
		userSettings,
		...rest
	})
}
