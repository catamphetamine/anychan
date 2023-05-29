import getPostText from 'social-components/utility/post/getPostText.js'

import getDataSource from '../utility/dataSource/getDataSource.js'

export default function getApplicationMeta() {
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