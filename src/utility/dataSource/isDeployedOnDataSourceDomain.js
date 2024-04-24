// import getConfiguration from '../../configuration.ts'

export default function isDeployedOnDataSourceDomain(dataSource) {
	if (!dataSource) {
		return false
	}

	if (typeof window !== 'undefined') {
		const domain = window.location.hostname.replace(WWW_REGEXP, '')
		// Replace the `www.` part just in case.
		if (dataSource.domain.replace(WWW_REGEXP, '') === domain) {
			return true
		}
		if (dataSource.domains) {
			if (dataSource.domains.includes(domain)) {
				return true
			}
		}
	}

	// For server-side rendering, could introduce a configuration parameter,
	// something like `useRelativeUrls: true`.
	// if (getConfiguration().useRelativeUrls) {
	// 	return true
	// }
	return false
}

// Some dataSources may be deployed on regular HTTP for simplicity.
// `4chan.org` has "https://www.4chan.org" website URL:
// when navigating to "https://4chan.org" images won't load.
// const HTTPS_REGEXP = /^https?:\/\/(www\.)?/
const WWW_REGEXP = /^(www\.)?/