import routes  from './routes.js'
import * as reducers from './redux/reducers.with-hot-reload.js'

import { getProvider, getProviderIconUrl } from './provider.js'
import getBasePath from './utility/getBasePath.js'
import getReactPagesConfig_ from 'frontend-lib/utility/react-pages.js'

import getPostText from 'social-components/utility/post/getPostText.js'

import ApplicationWrapper from './components/ApplicationWrapper.js'

// Uncomment for "server-side-rendering" build.
// // "Favicon" must be imported on the client side too
// // since no assets are emitted on the server side
// export { default as icon } from '../assets/images/icons/icon-192.png'

// const DEFAULT_META = {
// 	site_name   : 'anychan',
// 	title       : 'anychan',
// 	description : 'An alternative GUI for an imageboard (4chan.org, 2ch.hk, etc).',
// 	image       : 'https://upload.wikimedia.org/wikipedia/ru/5/5f/Original_Doge_meme.jpg'
// }

function getMeta() {
	if (getProvider()) {
		const {
			title,
			description,
			icon,
			language
		} = getProvider()

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
		}
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