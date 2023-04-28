import routes  from './routes.js'
import * as reducers from './redux/reducers.with-hot-reload.js'

import { getDataSource, getDataSourceIconUrl } from './dataSource.js'
import getBasePath from './utility/getBasePath.js'
import getReactPagesConfig_ from 'frontend-lib/utility/react-pages.js'

import getPostText from 'social-components/utility/post/getPostText.js'

import ApplicationWrapper from './components/ApplicationWrapper.js'
import PageLoading from './components/PageLoading.js'

// Uncomment for "server-side-rendering" build.
// // "Favicon" must be imported on the client side too
// // since no assets are emitted on the server side
// export { default as icon } from '../assets/images/icon/icon-192.png'

// const DEFAULT_META = {
// 	site_name   : 'anychan',
// 	title       : 'anychan',
// 	description : 'An alternative GUI for an imageboard (4chan.org, 2ch.hk, etc).',
// 	image       : 'https://upload.wikimedia.org/wikipedia/ru/5/5f/Original_Doge_meme.jpg'
// }

function getMeta() {
	// If no data source has been configured then an error will be shown.
	// The program shouldn't crash while attempting to access properties of a data source
	// when `getDataSource()` returns `undefined`.
	if (getDataSource()) {
		const {
			title,
			description,
			icon,
			language
		} = getDataSource()

		let meta = {
			site_name: title,
			title,
			// `description` is of `Content` type.
			// https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md
			description: getPostText({ content: description }, {
				ignoreAttachments: true
			}),
			image: icon
		}

		if (language) {
			meta.locale = getHTMLLocaleFromLanguage(language)
		}

		return meta
	}
}

export default function getReactPagesConfig() {
	return getReactPagesConfig_({
		container: ApplicationWrapper,
		routes,
		reducers,

		meta: getMeta(),
		basename: getBasePath(),

		errorPages: {
			'404': '/not-found',
			'500': '/error'
		},

		// When the website is open in a web browser,
		// hide website content under a "preloading" screen
		// until the application has finished loading.
		// It still "blinks" a bit in development mode
		// because CSS styles in development mode are included
		// not as `*.css` files but dynamically via javascript
		// by adding a `<style/>` DOM element, and that's why
		// in development mode styles are not applied immediately
		// in a web browser. In production mode CSS styles are
		// included as `*.css` files so they are applied immediately.
		initialLoadHideAnimationDuration: 160,
		initialLoadShowDelay: 0,
		InitialLoadComponent: PageLoading,
	})
}

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