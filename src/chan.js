import configuration from './configuration'

import * as dvach from './chan-parser/2ch'
import * as fourChan from './chan-parser/4chan'

export function getChan() {
	switch (getChanId()) {
		case '2ch':
			return dvach
		case '4chan':
			return fourChan
		default:
			throw new Error(`Unknown chan: ${getChanId()}`)
	}
}

function getChanId() {
	return window._chan || configuration.defaultChan
}

function setChanId(chanId) {
	window._chan = chanId
}

export const setChan = setChanId

// Adds `chan` URL parameter for multi-chan `gh-pages` demo.
export function addChanParameter(url) {
	if (getChanId() === configuration.defaultChan) {
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