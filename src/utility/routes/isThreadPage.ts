import type { Route } from 'react-pages'

export default function isThreadPage(route: Route) {
	return route.params.threadId !== undefined
}