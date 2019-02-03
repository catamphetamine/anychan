import routes  from './routes'
import * as reducers from './redux'

import { getChan } from './chan'
import { createConfig } from 'webapp-frontend/src/react-website.common'

// Uncomment for "server-side-rendering" build.
// // "Favicon" must be imported on the client side too
// // since no assets are emitted on the server side
// export { default as icon } from '../assets/images/icon@192x192.png'

export default createConfig({
	routes,
	reducers,

	meta: {
		site_name   : 'chanchan',
		title       : 'chanchan',
		description : 'An experimental GUI for an imageboard',
		image       : 'https://upload.wikimedia.org/wikipedia/ru/5/5f/Original_Doge_meme.jpg',
		locales     : ['ru_RU', 'en_US']
	},

	// `gh-pages` will have `/chanchan` base path.
	basename: getBasePath(),

	transformURL(url) {
		// Pass all `chan://` requests to chan API server.
		if (url.indexOf('chan://') === 0) {
			return getChan().getApiUrl('/' + url.slice('chan://'.length))
		}
	}
})

// `gh-pages` will have `/chanchan` base path.
function getBasePath() {
	if (window.location.origin === 'https://catamphetamine.github.io') {
		return window.location.pathname.slice(0, window.location.pathname.indexOf('/', '/'.length))
	}
}