import * as Sentry from '@sentry/browser'
import { onCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

import configuration from './configuration.js'

export default function() {
	// Initialize Cookie Policy.
	// Don't show Cookie Notice by default (better UX).
	window.SHOW_COOKIE_NOTICE = configuration.showCookieNotice

	// Initialize `sentry.io`.
	if (process.env.NODE_ENV === 'production') {
		if (configuration.sentryUrl) {
			onCookiesAccepted(() => {
				Sentry.init({
					dsn: configuration.sentryUrl
				})
			})
		}
	}

	// Redirect to HTTPS from HTTP.
	// Otherwise, the CORS Proxy will error, because it only accepts HTTPS
	// due to the "allow credentials" setting (it's a web standard requirement).
	if (window.location.hostname !== 'localhost' && window.location.protocol === 'http:') {
		window.location.href = window.location.href.replace('http:', 'https:')
	}
}