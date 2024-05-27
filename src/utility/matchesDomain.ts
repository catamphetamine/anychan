interface Parameters {
	domain?: string;
	domains?: string[];
}

export function actualDomainMatchesDomain({ domain, domains }: Parameters) {
	if (typeof window !== 'undefined') {
		return matchesDomain(getActualDomain(), { domain, domains })
	}

	// For server-side rendering, could introduce a configuration parameter,
	// something like `useRelativeUrls: true`.
	// if (getConfiguration().useRelativeUrls) {
	// 	return true
	// }
	return false
}


export function matchesDomain(actualDomain: string, { domain, domains }: Parameters) {
	if (domain) {
		// Replace the `www.` part just in case.
		if (domain.replace(WWW_REGEXP, '') === actualDomain) {
			return true
		}
	}
	if (domains) {
		if (domains.includes(actualDomain)) {
			return true
		}
	}
	return false
}

// Some dataSources may be deployed on regular HTTP for simplicity.
// `4chan.org` has "https://www.4chan.org" website URL:
// when navigating to "https://4chan.org" images won't load.
// const HTTPS_REGEXP = /^https?:\/\/(www\.)?/
const WWW_REGEXP = /^(www\.)?/

export function getActualDomain() {
	if (typeof window !== 'undefined') {
		return window.location.hostname.replace(WWW_REGEXP, '')
	}
}