import { render } from 'react-website'

import settings from './react-website'
import configuration from './configuration'

import { hideSidebar } from './redux/app'

export default async function() {
	// Renders the webpage on the client side
	const result = await render(settings, {
		onNavigate(url, location, { dispatch, getState }) {
			// Focus the page.
			document.querySelector('main').focus()
			// Hide sidebar navigation pop up (only on small screens).
			dispatch(hideSidebar())
			// Set up Google Analytics.
			if (configuration.googleAnalytics) {
				// Set up Google Analytics via `gtag`.
				gtag('config', configuration.googleAnalytics.id, {
					// Anonymize IP for all Google Analytics events.
					// https://developers.google.com/analytics/devguides/collection/gtagjs/ip-anonymization
					'anonymize_ip': true,
					// Specifies what percentage of users should be tracked.
					// This defaults to 100 (no users are sampled out) but
					// large sites may need to use a lower sample rate
					// to stay within Google Analytics processing limits.
					// 'sample_rate': 1,
					// Report "page view" event to Google Analytics.
					// https://stackoverflow.com/questions/37655898/tracking-google-analytics-page-views-in-angular2
					// https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
					'page_path': location.pathname
				})
			}
		}
	})
	// If there was an error during the initial rendering
	// then `result` will be `undefined`.
	if (result) {
		const { store, rerender } = result
		// Webpack "Hot Module Replacement"
		if (module.hot) {
			module.hot.accept('./react-website', () => {
				store.hotReload(settings.reducers)
				rerender()
			})
		}
	}
}