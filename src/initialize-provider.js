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
} from './provider.js'

import { addProviderLogos } from './providerLogos.js'

import getBasePath, {
	addBasePath,
	removeBasePath
} from './utility/getBasePath.js'

import configuration from './configuration.js'

export default function() {
	// Adding provider logos here instead of directly in `./providers.js`
	// because `import`ing logo files is only supported in Webpack
	// and it wouldn't work in console tests.
	addProviderLogos()

	// Get the provider id.
	let provider
	// Whether this website (app) supports multiple providers.
	let multiProvider
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
			multiProvider = true
		}
	}
	// Get provider id by domain.
	// (in case `anychan` is deployed on one of the providers' domains).
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
					// Get the "canonical" provider ID.
					// Some providers, like "8ch" have aliases like "8kun".
					id: defaultProvider.id,
					// How the application calls this provider.
					// For example, `"8kun"` is an alias for `"8ch"` provider ID,
					// so if the application specified `"8kun"` provider
					// then `"8ch"` provider is chosen and the `alias` property
					// is set to `"8kun"`.
					alias: defaultProvider.id === defaultProviderId ? undefined : defaultProviderId
				}
			}
		}
	}
	if (!provider) {
		throw new Error(`No provider ID has been set. Either set a default provider ID in configuration, or pass provider ID as part of the URL (example: "${location.origin}${getBasePath({ providerId: '4chan' })}").`)
	}
	setProviderById(provider.id, { alias: provider.alias, multiProvider })
	// Apply provider site icon.
	if (getProvider().icon) {
		const siteIcon = document.head.querySelector('[rel="shortcut icon"]')
		// On some weird devices in some weird browsers, it throws:
		// "TypeError: document.head.querySelector(...) is null".
		// For example, on some "Generic Tablet" on "Android 7.0".
		// Or, on "Mac OS X" in "Safari 14.0.1" it throws:
		// "null is not an object (evaluating 'document.head.querySelector('[rel="shortcut icon"]').href=(0,o.VH)().icon')".
		if (siteIcon) {
			siteIcon.href = getProvider().icon
		}
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