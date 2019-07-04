// This file only exists for multi-chan applications.

import TwoChannelParser from './2ch/Parser'
import FourChannelParser from './4chan/Parser'
import LynxChanParser from './lynxchan/Parser'

function getChanParser(parserId) {
	switch (parserId) {
		case '2ch':
			return TwoChannelParser
		case '4chan':
			return FourChannelParser
		case 'lynxchan':
			return LynxChanParser
		default:
			throw new TypeError(`Unknown chan parser: ${parserId}`)
	}
}

export default function createParser(chanSettings, options) {
	// `parser` setting is optional (falls back to `id`).
	const Parser = getChanParser(chanSettings.parser || chanSettings.id)
	return new Parser(chanSettings, options)
}