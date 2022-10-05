export default function isThreadPage(route) {
	return route.params.threadId !== undefined
}