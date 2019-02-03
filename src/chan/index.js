import configuration from '../configuration'

import * as dvach from './2ch'
import * as fourChan from './4chan'

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