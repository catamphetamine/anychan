import * as Sentry from '@sentry/browser'

import { getChanIdByDomain, setChan, getChan } from './chan'
import { applySettings } from './utility/settings'
import configuration from './configuration'

import DvaChannelSiteIcon from '../chan/2ch/icon.png'
import FourChanSiteIcon from '../chan/4chan/icon.png'
import EightChanSiteIcon from '../chan/8ch/icon.png'
import KohlChanSiteIcon from '../chan/kohlchan/icon.png'

// Initialize `sentry.io`.
if (process.env.NODE_ENV === 'production') {
	if (configuration['sentry.io']) {
		Sentry.init({
			dsn: configuration['sentry.io'].url
		})
	}
}

export default function() {
	// Initialize the chan being used.
	// `URL` is not available in IE11.
	// Supports `chan` URL parameter for multi-chan `gh-pages` demo.
	const chan = new URL(window.location.href).searchParams.get('chan') || getChanIdByDomain(window.location.domain)
	if (chan) {
		setChan(chan)
	}
	// Apply chan site icon.
	if (getSiteIcon(getChan().id)) {
		const siteIcon = document.head.querySelector('[rel="shortcut icon"]')
		siteIcon.href = getSiteIcon(getChan().id)
	}
	// Apply default settings.
	applySettings()
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