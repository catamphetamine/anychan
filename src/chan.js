import configuration from './configuration'
import CHANS from './chans'
import { getConfig } from 'imageboard'

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
	// "Default chan" id doesn't need to be explicitly passed around.
	if (getChanId() === configuration.chan) {
		return url
	}
	const isAbsoluteUrl = /^[a-z]+:\/\//.test(url)
	if (!isAbsoluteUrl) {
		// Otherwise `new URL(url)` will throw "Invalid URL".
		url = 'http://example.com' + url
	}
	// `URL` is not available in IE11.
	if (typeof URL === 'undefined' || typeof URLSearchParams === 'undefined') {
		return url
	}
	url = new URL(url)
	url.searchParams.set('chan', getChanId())
	url = url.href
	if (!isAbsoluteUrl) {
		url = url.slice('http://example.com'.length)
	}
	return url
}

// Some chans may be deployed on regular HTTP for simplicity.
// `4chan.org` has "https://www.4chan.org" website URL:
// when navigating to "https://4chan.org" images won't load.
// const HTTPS_REGEXP = /^https?:\/\/(www\.)?/
const WWW_REGEXP = /^(www\.)?/
export function isDeployedOnChanDomain(chan = getChan()) {
	if (typeof window !== 'undefined') {
		const domain = window.location.hostname.replace(WWW_REGEXP, '')
		if (getChanDomain(chan.id).replace(WWW_REGEXP, '') === domain) {
			return true
		}
		if (chan.domains) {
			if (chan.domains.includes(domain)) {
				return true
			}
		}
	}
	return false
}

export function getChanIdByDomain() {
	for (const chan of CHANS) {
		if (isDeployedOnChanDomain(chan)) {
			return chan
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

/**
 * Adds HTTP origin to a possibly relative URL.
 * For example, if this application is deployed on 2ch.hk domain
 * then there's no need to query `https://2ch.hk/...` URLs
 * and instead relative URLs `/...` should be queried.
 * This function checks whether the application should use
 * relative URLs and transforms the URL accordingly.
 */
export function getAbsoluteUrl(url) {
	if (url[0] === '/' && url[1] !== '/') {
		if (!isDeployedOnChanDomain() ) {
			return `https://${getChanDomain()}${url}`
		}
	}
	return url
}

export function getChanDomain(chanId = getChanId()) {
	return getChanConfig(chanId).domain
}

export function getChanConfig(chanId = getChanId()) {
	return getConfig(chanId) || {
		id: chanId,
		...getChan(chanId).engine
	}
}

export function getCommentUrl(board, thread, comment) {
	const config = getChanConfig()
	return `https://${getDomainByBoard(board, config)}${config.commentUrl
		.replace('{boardId}', board.id)
		.replace('{threadId}', thread.id)
		.replace('{commentId}', comment.id)
	}`
}

function getDomainByBoard(board, config) {
	if (config.domainByBoard) {
		const property = 'isNotSafeForWork'
		if (config.domainByBoard[property] && board[property]) {
			return config.domainByBoard[property]
		}
		if (config.domainByBoard['*']) {
			return config.domainByBoard['*']
		}
	}
	return config.domain
}