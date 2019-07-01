import routes  from './routes'
import * as reducers from './redux'

import { getChan, getChanIconUrl } from './chan'
import getBasePath from './utility/getBasePath'
import { createConfig } from 'webapp-frontend/src/react-website.common'

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

export default createConfig({
	routes,
	reducers,

	meta: {
		site_name   : getChan().title,
		title       : getChan().title,
		description : getChan().description,
		image       : getChan().icon,
		locale      : getChan().language && getHTMLLocaleFromLanguage(getChan().language)
	},

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