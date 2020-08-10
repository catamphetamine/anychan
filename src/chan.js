import configuration from './configuration'
import CHANS from './chans'
import { getConfig } from 'imageboard'

export function getChan(id = getChanId()) {
	const chan = CHANS.find(_ => _.id === id)
	if (chan) {
		return chan
	}
	if (typeof configuration.chan === 'object') {
		if (configuration.chan.id === id) {
			return configuration.chan
		}
	}
	throw new Error(`Unknown imageboard: ${id}`)
}

export function getChanId() {
	if (typeof window === 'undefined') {
		throw new Error('Server-side code not written')
	}
	return window._chan
}

export function setChanId(chanId) {
	if (typeof window === 'undefined') {
		throw new Error('Server-side code not written')
	}
	window._chan = chanId
}

export function getDefaultChanId() {
	if (typeof configuration.chan === 'string') {
		return configuration.chan
	} else if (typeof configuration.chan === 'object') {
		return configuration.chan.id
	}
}

export function shouldIncludeChanInPath() {
	return getDefaultChanId() ? false : true
}

export function getChanFromPath(path) {
	const match = path.match(/^\/([^\/]+)/)
	if (match) {
		const possibleChanId = match[1]
		const chan = CHANS.find(_ => _.id === possibleChanId)
		if (chan) {
			return possibleChanId
		}
	}
}

export function addChanToPath(path, chanId) {
	return `/${chanId}${path}`
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

export function getImageboardConfig(chanId = getChanId()) {
	return getConfig(chanId) || getChan(chanId)
}

export function getChanDomain(chanId = getChanId()) {
	return getImageboardConfig(chanId).domain
}

export function getCommentUrl(board, thread, comment) {
	const config = getImageboardConfig()
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