import isChannelPage from './isChannelPage.js'
import isThreadPage from './isThreadPage.js'

export default function isContentSectionsPage(route) {
	return isChannelPage(route) ||
		isThreadPage(route) ||
		route.location.pathname === '/settings'
}
