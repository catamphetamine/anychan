import * as Sentry from '@sentry/browser'
import { onCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'

import { getChanIdByDomain, setChanId, getChan } from './chan'
import { applySettings } from './utility/settings'
import configuration from './configuration'

import DvaChannelSiteIcon from '../chan/2ch/icon.png'
import FourChanSiteIcon from '../chan/4chan/icon.png'
import EightChanSiteIcon from '../chan/8ch/icon.png'
import KohlChanSiteIcon from '../chan/kohlchan/icon.png'

// Initialize Cookie Policy.
// Don't show Cookie Notice by default (better UX).
window.SHOW_COOKIE_NOTICE = configuration.cookieNotice

// Initialize `sentry.io`.
if (process.env.NODE_ENV === 'production') {
	if (configuration['sentry.io']) {
		onCookiesAccepted(() => {
			Sentry.init({
				dsn: configuration['sentry.io'].url
			})
		})
	}
}

export default function() {
	// Initialize the chan being used.
	// `URL` is not available in IE11.
	// Supports `chan` URL parameter for multi-chan `gh-pages` demo.
	const chan = new URL(window.location.href).searchParams.get('chan') || getChanIdByDomain(window.location.domain)
	if (chan) {
		setChanId(chan)
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