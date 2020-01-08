import {
	getChanIdByDomain,
	setChanId,
	getChan,
	shouldIncludeChanInPath,
	getChanFromPath,
	addChanToPath
} from './chan'

import {
	addBasePath,
	removeBasePath
} from './utility/getBasePath'

export default function() {
	// Get the chan id.
	// Chan id can be specified as "chan" URL parameter
	// (`chan` URL parameter is used for multi-chan `gh-pages` demo)
	// or it could be derived from the current domain.
	// If not chan id is determined at this step then the
	// "default chan" configured in `configuration.json` will be used.
	let chan
	// `URL` is not available in IE11.
	if (typeof URL !== 'undefined' && typeof URLSearchParams !== 'undefined') {
		const urlParams = new URL(window.location.href).searchParams
		// `.searchParams` still may be `undefined` here in old versions of Chrome.
		if (urlParams) {
			const chanParam = urlParams.get('chan')
			chan = chanParam
			// If chan id should be part of URL path
			// instead of a URL parameter, then redirect.
			if (chanParam && shouldIncludeChanInPath()) {
				const url = new URL(window.location.href)
				url.searchParams.delete('chan')
				url.pathname = addBasePath(addChanToPath(removeBasePath(url.pathname), chanParam))
				window.location = decodeURI(url.href)
			}
		}
	}
	if (!chan) {
		if (shouldIncludeChanInPath()) {
			chan = getChanFromPath(removeBasePath(window.location.pathname))
		}
	}
	if (!chan) {
		chan = getChanIdByDomain()
	}
	if (chan) {
		setChanId(chan)
	}
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