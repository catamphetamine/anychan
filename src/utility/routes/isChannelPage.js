export default function isChannelPage(route) {
	return route.params.channelId !== undefined && route.params.threadId === undefined
}