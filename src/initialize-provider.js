import {
	getProviderIdByDomain,
	getDefaultProviderId,
	setProviderById,
	getProviderById,
	getProvider,
	shouldIncludeProviderInPath,
	getProviderIdFromPath,
	addProviderIdToPath,
	getLegacyImplicitDefaultProvider
} from './provider'

import getBasePath, {
	addBasePath,
	removeBasePath
} from './utility/getBasePath'

import configuration from './configuration'

export default function() {
	// Get provider id.
	let provider
	// Deprecated.
	// Previously, provider id could be specified as "chan" URL parameter
	// (`chan` URL parameter was used for multi-provider `gh-pages` demo).
	// `URL` is not available in IE11.
	if (typeof URL !== 'undefined' && typeof URLSearchParams !== 'undefined') {
		// Get provider id from the legacy `chan` URL parameter.
		const urlParams = new URL(window.location.href).searchParams
		// `.searchParams` still may be `undefined` here in old versions of Chrome.
		if (urlParams) {
			const chanParam = urlParams.get('chan')
			// Transform `chan` URL parameter into provider id
			// being part of URL path, and redirect to that URL.
			if (chanParam && shouldIncludeProviderInPath()) {
				provider = {
					id: chanParam
				}
				const url = new URL(window.location.href)
				url.searchParams.delete('chan')
				url.pathname = addBasePath(addProviderIdToPath(removeBasePath(url.pathname), chanParam))
				// Redirect.
				window.location = decodeURI(url.href)
			}
		}
	}
	// Get provider id from path.
	// Example: "/4chan/b/12345".
	if (!provider) {
		if (shouldIncludeProviderInPath()) {
			provider = getProviderIdFromPath(removeBasePath(window.location.pathname))
		}
	}
	// Get provider id by domain.
	// (in case `captchan` is deployed on one of the providers' domains).
	if (!provider) {
		const providerId = getProviderIdByDomain()
		if (providerId) {
			provider = { id: providerId }
		}
	}
	// If no provider id is determined at this step then the
	// default "provider" configured in `configuration.json` will be used.
	if (!provider) {
		const defaultProviderId = getDefaultProviderId()
		if (defaultProviderId) {
			const defaultProvider = getProviderById(defaultProviderId)
			if (defaultProvider) {
				provider = {
					id: defaultProvider.id,
					alias: defaultProvider.id === defaultProviderId ? undefined : defaultProviderId
				}
			}
		}
	}
	if (!provider) {
		return alert(`No provider ID has been set. Either set a default provider ID in configuration, or pass provider ID as part of the URL (example: "${location.origin}${getBasePath({ providerId: '4chan' })}").`)
	}
	setProviderById(provider.id, { alias: provider.alias })
	// Apply provider site icon.
	if (getProvider().icon) {
		const siteIcon = document.head.querySelector('[rel="shortcut icon"]')
		siteIcon.href = getProvider().icon
	}
	// Actually, don't set slide background color to a shade of blue
	// because in "dark mode" it would be too bright.
	// // `4chan.org` uses a shade of blue for its transparent PNG image color.
	// // Setting `--Slideshow-Slide-backgroundColor` prevents visual flicker
	// // when images are expanded from thumbnails via an animation (on mobile devices).
	// if (provider === '4chan') {
	// 	document.documentElement.style.setProperty('--Slideshow-Slide-backgroundColor', '#d3d9f1')
	// }
}