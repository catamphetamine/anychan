import type { Route } from 'react-pages'

import isChannelPage from './isChannelPage.js'
import isThreadPage from './isThreadPage.js'

export default function isContentSectionsPage(route: Route) {
	return isChannelPage(route) ||
		isThreadPage(route) ||
		route.location.pathname === '/settings' ||
		route.location.pathname === '/user'
}
