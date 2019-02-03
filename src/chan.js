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

export function addChanParameter(url) {
	if (getChanId() === configuration.defaultChan) {
		return url
	}
	if (url.indexOf('?') < 0) {
		return url + `?chan=${getChanId()}`
	}
	return url + `&chan=${getChanId()}`
}