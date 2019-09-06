export function isBoardLocation(route) {
	return route.params.board !== undefined && route.params.thread === undefined
}

export function isThreadLocation(route) {
	return route.params.thread !== undefined
}

export function isContentSectionsContent(route) {
	return isBoardLocation(route) ||
		isThreadLocation(route) ||
		route.location.pathname === '/settings'
}

export function isBoardsLocation(route) {
	return route.location.pathname === '/boards'
}