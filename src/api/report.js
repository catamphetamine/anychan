export default async function report({
	channelId,
	threadId,
	commentId,
	http,
	userSettings,
	dataSource,
	...rest
}) {
	return await dataSource.api.report({
		channelId,
		threadId,
		commentId,
		http,
		userSettings,
		...rest
	})
}
