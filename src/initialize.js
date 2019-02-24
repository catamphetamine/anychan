import { setChan, getChan } from './chan'

import DvaChannelSiteIcon from '../chan/2ch/icon.png'
import FourChanSiteIcon from '../chan/4chan/icon.png'

export default function() {
	// `URL` is not available in IE11.
	// Supports `chan` URL parameter for multi-chan `gh-pages` demo.
	const chan = new URL(window.location.href).searchParams.get('chan')
	if (chan) {
		setChan(chan)
	}
	if (getSiteIcon(getChan().id)) {
		const siteIcon = document.head.querySelector('[rel="shortcut icon"]')
		siteIcon.href = getSiteIcon(getChan().id)
	}
}

export function getSiteIcon(chanId) {
	switch (chanId) {
		case '2ch':
			return DvaChannelSiteIcon
		case '4chan':
			return FourChanSiteIcon
	}
}