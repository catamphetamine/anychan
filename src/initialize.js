import { setChan, getChan } from './chan'
import { applySettings, getSettings } from './utility/settings'

import DvaChannelSiteIcon from '../chan/2ch/icon.png'
import FourChanSiteIcon from '../chan/4chan/icon.png'
import EightChanSiteIcon from '../chan/8ch/icon.png'
import KohlChanSiteIcon from '../chan/kohlchan/icon.gif'

export default function() {
	// Initialize the chan being used.
	// `URL` is not available in IE11.
	// Supports `chan` URL parameter for multi-chan `gh-pages` demo.
	const chan = new URL(window.location.href).searchParams.get('chan')
	if (chan) {
		setChan(chan)
	}
	// Apply chan site icon.
	if (getSiteIcon(getChan().id)) {
		const siteIcon = document.head.querySelector('[rel="shortcut icon"]')
		siteIcon.href = getSiteIcon(getChan().id)
	}
	// Apply default settings.
	applySettings(getSettings())
}

export function getSiteIcon(chanId) {
	switch (chanId) {
		case '2ch':
			return DvaChannelSiteIcon
		case '4chan':
			return FourChanSiteIcon
		case '8ch':
			return EightChanSiteIcon
		case 'kohlchan':
			return KohlChanSiteIcon
	}
}