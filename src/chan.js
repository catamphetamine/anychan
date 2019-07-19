import configuration from './configuration'
import CHANS from './chans'

export function getChan(id = getChanId()) {
	if (id) {
		const chan = CHANS.find(_ => _.id === id)
		if (!chan) {
			throw new Error(`Unknown chan: ${id}`)
		}
		return chan
	}
	if (typeof configuration.chan === 'object') {
		return configuration.chan
	}
	throw new Error('No chan configured')
}

function getChanId() {
	return (typeof window !== 'undefined' && window._chan) ||
		(typeof configuration.chan === 'string' && configuration.chan)
}

export function setChanId(chanId) {
	if (typeof window !== 'undefined') {
		window._chan = chanId
	}
}

// Adds `chan` URL parameter for multi-chan `gh-pages` demo.
export function addChanParameter(url) {
	// Custom configured chans don't have a "built-in chan id".
	if (!getChanId()) {
		return url
	}
	if (getChanId() === configuration.chan) {
		return url
	}
	const isAbsoluteUrl = /^[a-z]+:\/\//.test(url)
	if (!isAbsoluteUrl) {
		// Otherwise `new URL(url)` will throw "Invalid URL".
		url = 'http://example.com' + url
	}
	// `URL` is not available in IE11.
	url = new URL(url)
	url.searchParams.set('chan', getChanId())
	url = url.href
	if (!isAbsoluteUrl) {
		url = url.slice('http://example.com'.length)
	}
	return url
}

export function shouldUseRelativeUrls() {
	if (typeof window !== 'undefined') {
		const domain = window.location.hostname
		if (getChan().domains) {
			if (getChan().domains.includes(domain)) {
				return true
			}
		}
	}
	return false
}

export function getChanIdByDomain(domain) {
	for (const chan of CHANS) {
		for (const domain of chan.domains) {
			if (window.location.domain === domain) {
				return chan
			}
		}
	}
}

export function getProxyUrl() {
	if (getChan().proxy.aws) {
		if (configuration.corsProxyUrlAws) {
			return configuration.corsProxyUrlAws
		}
	}
	if (configuration.corsProxyUrl) {
		return configuration.corsProxyUrl
	}
}