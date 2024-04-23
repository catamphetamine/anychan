import getDataSourceIdByDomain from './utility/dataSource/getDataSourceIdByDomain.js'
import getDefaultDataSourceId from './utility/dataSource/getDefaultDataSourceId.js'
import getCurrentDataSourceInfo from './utility/dataSource/getCurrentDataSourceInfo.js'
import getDataSourceById from './utility/dataSource/getDataSourceById.js'
import shouldIncludeDataSourceInPath from './utility/dataSource/shouldIncludeDataSourceInPath.js'
import getDataSourceIdFromPath from './utility/dataSource/getDataSourceIdFromPath.js'
import addDataSourceIdToPath from './utility/dataSource/addDataSourceIdToPath.js'

import { addDataSourceLogos } from './dataSourceLogos.js'

import {
	addBasePath,
	removeBasePath
} from './utility/getBasePath.js'

export default function() {
	// Adding data source logos here instead of directly in `./dataSources.js`
	// because `import`ing logo files is only supported in Webpack
	// and it wouldn't work in console tests.
	addDataSourceLogos()

	// Get the data source id.
	let dataSource
	// Whether this website (app) supports multiple dataSources.
	let multiDataSource

	// Deprecated.
	// Previously, data source id could be specified as "chan" URL parameter
	// (`chan` URL parameter was used for multi-dataSource `gh-pages` demo).
	// `URL` is not available in IE11.
	if (typeof URL !== 'undefined' && typeof URLSearchParams !== 'undefined') {
		// Get data source id from the legacy `chan` URL parameter.
		const urlParams = new URL(window.location.href).searchParams
		// `.searchParams` still may be `undefined` here in old versions of Chrome.
		if (urlParams) {
			const chanParam = urlParams.get('chan')
			// Transform `chan` URL parameter into data source id
			// being part of URL path, and redirect to that URL.
			if (chanParam && shouldIncludeDataSourceInPath()) {
				dataSource = {
					id: chanParam
				}
				const url = new URL(window.location.href)
				url.searchParams.delete('chan')
				url.pathname = addBasePath(addDataSourceIdToPath(removeBasePath(url.pathname), chanParam))
				// Redirect.
				window.location = decodeURI(url.href)
			}
		}
	}

	// Get data source id from path.
	// Example: "/4chan/b/12345".
	if (!dataSource) {
		if (shouldIncludeDataSourceInPath()) {
			dataSource = getDataSourceIdFromPath(removeBasePath(window.location.pathname))
			multiDataSource = true
		}
	}

	// Get data source id by domain.
	// (in case `anychan` is deployed on one of the dataSources' domains).
	if (!dataSource) {
		const dataSourceId = getDataSourceIdByDomain()
		if (dataSourceId) {
			dataSource = { id: dataSourceId }
		}
	}
	// If no data source id is determined at this step then the
	// default "dataSource" configured in `configuration.json` will be used.
	if (!dataSource) {
		const defaultDataSourceId = getDefaultDataSourceId()
		if (defaultDataSourceId) {
			const defaultDataSource = getDataSourceById(defaultDataSourceId)
			if (defaultDataSource) {
				dataSource = {
					// Get the "canonical" data source ID.
					// Some dataSources, like "8ch" have aliases like "8kun".
					id: defaultDataSource.id,
					// How the application calls this dataSource.
					// For example, `"8kun"` is an alias for `"8ch"` data source ID,
					// so if the application specified `"8kun"` dataSource
					// then `"8ch"` data source is chosen and the `alias` property
					// is set to `"8kun"`.
					alias: defaultDataSource.id === defaultDataSourceId ? undefined : defaultDataSourceId
				}
			}
		}
	}

	if (!dataSource) {
		throw new Error('NO_DATA_SOURCE')
	}

	const dataSourceInfo = getCurrentDataSourceInfo({
		id: dataSource.id,
		alias: dataSource.alias,
		multiDataSource
	})

	// Apply data source icon as a website icon.
	if (dataSourceInfo.dataSource.icon) {
		const siteIcon = document.head.querySelector('[rel="shortcut icon"]')
		// On some weird devices in some weird browsers, it throws:
		// "TypeError: document.head.querySelector(...) is null".
		// For example, on some "Generic Tablet" on "Android 7.0".
		// Or, on "Mac OS X" in "Safari 14.0.1" it throws:
		// "null is not an object (evaluating 'document.head.querySelector('[rel="shortcut icon"]').href=(0,o.VH)().icon')".
		if (siteIcon) {
			siteIcon.href = dataSourceInfo.dataSource.icon
		}
	}

	// When browsing a certain datasource, add a `manifest.json` file for that datasource.
	// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
	if (dataSourceInfo.dataSource.manifestUrl) {
		window.anychan_activateProgressiveWebApp({
			manifestUrl: dataSourceInfo.dataSource.manifestUrl
		})
	}

	// Actually, don't set slide background color to a shade of blue
	// because in "dark mode" it would be too bright.
	// // `4chan.org` uses a shade of blue for its transparent PNG image color.
	// // Setting `--Slideshow-Slide-backgroundColor` prevents visual flicker
	// // when images are expanded from thumbnails via an animation (on mobile devices).
	// if (dataSource === '4chan') {
	// 	document.documentElement.style.setProperty('--Slideshow-Slide-backgroundColor', '#d3d9f1')
	// }

	return dataSourceInfo
}