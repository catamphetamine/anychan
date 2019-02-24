import configuration from './configuration'

import DvaChannelIcon from '../chan/2ch/icon.png'
import FourChanIcon from '../chan/4chan/icon.png'

import DvaChannelLogo from '../chan/2ch/logo.svg'
import FourChanLogo from '../chan/4chan/logo.svg'

import dvaChannel from '../chan/2ch'
import fourChan from '../chan/4chan'

const CHANS = [
	dvaChannel,
	fourChan
]

// These URLs could be strings inside `index.json` hosted somewhere on a CDN.
dvaChannel.icon = DvaChannelIcon
fourChan.icon = FourChanIcon

dvaChannel.logo = DvaChannelLogo
fourChan.logo = FourChanLogo

export function getChan(id = getChanId()) {
	const chan = CHANS.find(_ => _.id === id)
	if (chan) {
		return chan
	}
	throw new Error(`Unknown chan: ${id}`)
}

function getChanId() {
	return (typeof window !== 'undefined' && window._chan) || configuration.defaultChan
}

function setChanId(chanId) {
	if (typeof window !== 'undefined') {
		window._chan = chanId
	}
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