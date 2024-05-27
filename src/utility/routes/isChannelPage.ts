import type { Route } from 'react-pages'

export default function isChannelPage(route: Route) {
	return route.params.channelId !== undefined && route.params.threadId === undefined
}