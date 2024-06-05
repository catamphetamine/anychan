// import * as Sentry from '@sentry/browser'
import * as Sentry from '@sentry/react'

import { onCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

import getConfiguration from './getConfiguration.js'
import messagesLabels from './messages/messagesLabels.js'

export default function() {
	// Add any custom javascript to the `<head/>`.
	if (getConfiguration().javascript) {
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.textContent = getConfiguration().javascript
		document.head.appendChild(script)
	}

	// Add any custom HTML to the `<body/>`.
	if (getConfiguration().bodyHtml) {
		// document.body.innerHTML += getConfiguration().bodyHtml
		document.getElementById('bodyHtml').innerHTML = getConfiguration().bodyHtml
	}

	// Initialize Cookie Policy.
	// Don't show Cookie Notice by default (better UX).
	window.SHOW_COOKIE_NOTICE = getConfiguration().showCookieNotice

	// Initialize `sentry.io`.
	if (process.env.NODE_ENV === 'production') {
		if (getConfiguration().sentryUrl) {
			onCookiesAccepted(() => {
				Sentry.init({
					// integrations: [
					// 	// No react router
					// 	Sentry.browserTracingIntegration()
					// ],
					dsn: getConfiguration().sentryUrl
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


	// This application exposes the messages in the form of a global variable called `LABELS`.
	// This hypothetically would allow end users to customize the messages by including
	// an "extension" javascript file on a page.
	// That script could do something like: `LABELS.ru.settings.theme.title = "Тема"`
	//
	// TypeScript doesn't seem to include `src/types/global.d.ts` when running `yarn test` command.
	// Because of that, when running the app normally via `yarn dev` there's no error at the line below,
	// but when running tests via `yarn test`, there is an error.
	//
	window.LABELS = messagesLabels
}