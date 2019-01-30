import routes  from './routes'
import * as reducers from './redux'

import { createConfig } from 'webapp-frontend/src/react-website.common'

// Uncomment for "server-side-rendering" build.
// // "Favicon" must be imported on the client side too
// // since no assets are emitted on the server side
// export { default as icon } from '../assets/images/icon@192x192.png'

export default createConfig({
	routes,
	reducers,

	// `gh-pages` will have `/chanchan` base path.
	basename: getBasePath(),

	transformURL(url) {
		// Pass all `2ch://` requests to chan API server.
		if (url.indexOf('2ch://') === 0) {
			return configuration.chanApiBaseURL + '/' + url.slice('2ch://'.length)
		}
	}
})

// `gh-pages` will have `/chanchan` base path.
function getBasePath() {
	if (window.location.origin === 'https://catamphetamine.github.io') {
		return window.location.pathname.slice(0, window.location.pathname.indexOf('/', '/'.length))
	}
}