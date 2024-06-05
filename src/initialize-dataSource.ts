import type { DataSource } from './types/DataSource.js'

import getDataSourceIdByDomain from './utility/dataSource/getDataSourceIdByDomain.js'
import getDefaultDataSourceId from './utility/dataSource/getDefaultDataSourceId.js'
import getCurrentDataSourceById from './utility/dataSource/getCurrentDataSourceById.js'
import getDataSourceById from './utility/dataSource/getDataSourceById.js'
import shouldIncludeDataSourceInPath from './utility/dataSource/shouldIncludeDataSourceInPath.js'
import getDataSourceIdFromPath from './utility/dataSource/getDataSourceIdFromPath.js'
import addDataSourceIdToPath from './utility/dataSource/addDataSourceIdToPath.js'

import addDataSourceManifestUrls from './dataSourcesAddManifestUrls.js'

import {
	addBasePath,
	removeBasePath
} from './utility/getBasePath.js'
import { getActualDomain, matchesDomain } from './utility/matchesDomain.js'

import DATA_SOURCES_LIST from '../dataSources/index-with-resources.js'

export default function() {
	addDataSourceManifestUrls(DATA_SOURCES_LIST)

	// Get the data source id.
	let dataSourceKey: {
		id: DataSource['id'],
		alias?: DataSource['aliases'][number]
	}

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
				dataSourceKey = {
					id: chanParam
				}
				const url = new URL(window.location.href)
				url.searchParams.delete('chan')
				url.pathname = addBasePath(addDataSourceIdToPath(removeBasePath(url.pathname), chanParam))
				// Redirect.
				window.location.href = decodeURI(url.href)
			}
		}
	}

	// Get data source id from path.
	// Example: "/4chan/b/12345".
	if (!dataSourceKey) {
		if (shouldIncludeDataSourceInPath()) {
			dataSourceKey = getDataSourceIdFromPath(removeBasePath(window.location.pathname))
			multiDataSource = true
		}
	}

	// Get data source id by domain.
	// (in case `anychan` is deployed on one of the dataSources' domains).
	if (!dataSourceKey) {
		const dataSourceId = getDataSourceIdByDomain()
		if (dataSourceId) {
			dataSourceKey = { id: dataSourceId }
		}
	}
	// If no data source id is determined at this step then the
	// default "dataSource" configured in `configuration.json` will be used.
	if (!dataSourceKey) {
		const defaultDataSourceId = getDefaultDataSourceId()
		if (defaultDataSourceId) {
			const defaultDataSource = getDataSourceById(defaultDataSourceId)
			if (defaultDataSource) {
				dataSourceKey = {
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

	if (!dataSourceKey) {
		throw new Error('NO_DATA_SOURCE')
	}

	const dataSource = getCurrentDataSourceById(dataSourceKey.id)

	// The actual domain the application is running on.
	const actualDomain = getActualDomain()

	const dataSourceInfo = {
		dataSource,
		dataSourceAlias: dataSourceKey.alias,
		multiDataSource,
		// If the application is running on an "originaL" domain of a data source,
		// this variable is gonna be the domain name.
		// For example, if `dataSource` is `"4chan"` and the appliation is running on `4chan.org` domain,
		// the variable is gonna be `"4chan.org"`.
		originalDomain: actualDomain && matchesDomain(actualDomain, dataSource) ? actualDomain : undefined
	}

	// Apply data source icon as a website icon.
	if (dataSourceInfo.dataSource.icon) {
		const siteIcon = document.head.querySelector('[rel="shortcut icon"]') as HTMLLinkElement
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