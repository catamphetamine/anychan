export function isBoardLocation(route) {
	return route.params.board
}

export function isThreadLocation(route) {
	return route.params.thread
}

export function isContentSectionsContent(route) {
	return isBoardLocation(route) ||
		isThreadLocation(route) ||
		route.location.pathname === '/settings'
}