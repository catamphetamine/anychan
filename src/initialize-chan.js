import { getChanIdByDomain, setChanId, getChan } from './chan'

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
			chan = urlParams.get('chan')
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