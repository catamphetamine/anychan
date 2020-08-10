import {
	getChanIdByDomain,
	getDefaultChanId,
	setChanId,
	getChan,
	shouldIncludeChanInPath,
	getChanFromPath,
	addChanToPath,
	getLegacyImplicitDefaultChan
} from './chan'

import getBasePath, {
	addBasePath,
	removeBasePath
} from './utility/getBasePath'

import configuration from './configuration'

export default function() {
	// Get imageboard id.
	let chan
	// Previously, imageboard id could be specified as "chan" URL parameter
	// (`chan` URL parameter was used for multi-imageboard `gh-pages` demo).
	// `URL` is not available in IE11.
	if (typeof URL !== 'undefined' && typeof URLSearchParams !== 'undefined') {
		// Get imageboard id from `chan` URL parameter.
		const urlParams = new URL(window.location.href).searchParams
		// `.searchParams` still may be `undefined` here in old versions of Chrome.
		if (urlParams) {
			const chanParam = urlParams.get('chan')
			chan = chanParam
			// Transform `chan` URL parameter into imageboard id
			// being part of URL path, and redirect to that URL.
			if (chanParam && shouldIncludeChanInPath()) {
				const url = new URL(window.location.href)
				url.searchParams.delete('chan')
				url.pathname = addBasePath(addChanToPath(removeBasePath(url.pathname), chanParam))
				// Redirect.
				window.location = decodeURI(url.href)
			}
		}
	}
	// Get chan id from path.
	// Example: "/4chan/b/12345".
	if (!chan) {
		if (shouldIncludeChanInPath()) {
			chan = getChanFromPath(removeBasePath(window.location.pathname))
		}
	}
	// Get imageboard id by domain.
	// (in case `captchan` is deployed on one of the chans' domains).
	if (!chan) {
		chan = getChanIdByDomain()
	}
	// If no imageboard id is determined at this step then the
	// default "chan" configured in `configuration.json` will be used.
	if (!chan) {
		chan = getDefaultChanId()
	}
	if (!chan) {
		return alert(`No imageboard ID has been set. Either set a default imageboard ID in configuration, or pass imageboard ID as part of the URL (example: "${location.origin}${getBasePath({ chan: '4chan' })}").`)
	}
	setChanId(chan)
	// Apply chan site icon.
	if (getChan().icon) {
		const siteIcon = document.head.querySelector('[rel="shortcut icon"]')
		siteIcon.href = getChan().icon
	}
	// Actually, don't set slide background color to a shade of blue
	// because in "dark mode" it would be too bright.
	// // `4chan.org` uses a shade of blue for its transparent PNG image color.
	// // Setting `--SlideshowSlide-backgroundColor` prevents visual flicker
	// // when images are expanded from thumbnails via an animation (on mobile devices).
	// if (chan === '4chan') {
	// 	document.documentElement.style.setProperty('--SlideshowSlide-backgroundColor', '#d3d9f1')
	// }
}