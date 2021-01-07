export function isChannelLocation(route) {
	return route.params.channelId !== undefined && route.params.threadId === undefined
}

export function isThreadLocation(route) {
	return route.params.threadId !== undefined
}

export function isContentSectionsContent(route) {
	return isChannelLocation(route) ||
		isThreadLocation(route) ||
		route.location.pathname === '/settings'
}

export function isChannelsLocation(route) {
	return route.location.pathname === '/channels'
}