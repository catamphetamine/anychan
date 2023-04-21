// Some providers may be deployed on regular HTTP for simplicity.
// `4chan.org` has "https://www.4chan.org" website URL:
// when navigating to "https://4chan.org" images won't load.
// const HTTPS_REGEXP = /^https?:\/\/(www\.)?/
const WWW_REGEXP = /^(www\.)?/
export default function isDeployedOnProviderDomain(provider) {
	if (!provider) {
		return false
	}
	if (typeof window !== 'undefined') {
		const domain = window.location.hostname.replace(WWW_REGEXP, '')
		// Replace the `www.` part just in case.
		if (provider.domain.replace(WWW_REGEXP, '') === domain) {
			return true
		}
		if (provider.domains) {
			if (provider.domains.includes(domain)) {
				return true
			}
		}
	}
	return false
}