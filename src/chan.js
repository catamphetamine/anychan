import configuration from './configuration'

import TwoChannelIcon from '../chan/2ch/icon.png'
import FourChanIcon from '../chan/4chan/icon.png'
import EightChanIcon from '../chan/8ch/icon.png'
import KohlChanIcon from '../chan/kohlchan/icon.gif'

import TwoChannelLogo from '../chan/2ch/logo.svg'
import FourChanLogo from '../chan/4chan/logo.svg'
import EightChanLogo from '../chan/8ch/logo.svg'
import KohlChanLogo from '../chan/kohlchan/logo.png'

import twoChannel from '../chan/2ch'
import fourChan from '../chan/4chan'
import eightChan from '../chan/8ch'
import kohlChan from '../chan/kohlchan'

const CHANS = [
	twoChannel,
	fourChan,
	eightChan,
	kohlChan
]

// These URLs could be strings inside `index.json` hosted somewhere on a CDN.
twoChannel.icon = TwoChannelLogo
fourChan.icon = FourChanIcon
eightChan.icon = EightChanIcon
kohlChan.icon = KohlChanIcon

twoChannel.logo = TwoChannelLogo
fourChan.logo = FourChanLogo
eightChan.logo = EightChanLogo
kohlChan.logo = KohlChanLogo

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