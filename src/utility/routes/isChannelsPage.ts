import type { Route } from 'react-pages'

export default function isChannelsPage(route: Route) {
	return route.location.pathname === '/channels'
}