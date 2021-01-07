import routes  from './routes'
import * as reducers from './redux'

import { getProvider, getProviderIconUrl } from './provider'
import getBasePath from './utility/getBasePath'
import { createConfig } from 'webapp-frontend/src/react-pages.common'

// Uncomment for "server-side-rendering" build.
// // "Favicon" must be imported on the client side too
// // since no assets are emitted on the server side
// export { default as icon } from '../assets/images/icon@192x192.png'

// const DEFAULT_META = {
// 	site_name   : 'captchan',
// 	title       : 'captchan',
// 	description : 'An alternative GUI for an imageboard (4chan.org, 2ch.hk, etc).',
// 	image       : 'https://upload.wikimedia.org/wikipedia/ru/5/5f/Original_Doge_meme.jpg'
// }

let meta
if (getProvider()) {
	meta = {
		site_name   : getProvider().title,
		title       : getProvider().title,
		description : getProvider().description,
		image       : getProvider().icon,
		locale      : getProvider().language && getHTMLLocaleFromLanguage(getProvider().language)
	}
}

export default createConfig({
	routes,
	reducers,
	meta,
	// `gh-pages` will have `/captchan` base path.
	basename: getBasePath()
})

function getHTMLLocaleFromLanguage(language) {
	switch (language) {
		case 'ru':
			return 'ru_RU'
		case 'en':
			return 'en_US'
		case 'de':
			return 'de_DE'
		default:
			throw new Error(`Unsupported language: ${language}`)
	}
}