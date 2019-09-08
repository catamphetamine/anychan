import * as Sentry from '@sentry/browser'
import { onCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'

import { getChanIdByDomain, setChanId, getChan } from './chan'
import Settings from './utility/settings'
import { delayedDispatch } from './utility/dispatch'
import configuration from './configuration'

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
	// Apply user settings.
	Settings.apply({
		dispatch: delayedDispatch
	})
}