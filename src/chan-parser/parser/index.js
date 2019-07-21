// This file only exists for multi-chan applications.

import TwoChannelParser from './2ch/Parser'
import FourChannelParser from './4chan/Parser'
import LynxChanParser from './lynxchan/Parser'

import { getChanParser } from '../chan'

function getParser(parserId) {
	switch (parserId) {
		case '2ch':
			return TwoChannelParser
		case '4chan':
			return FourChannelParser
		case 'lynxchan':
			return LynxChanParser
		default:
			throw new RangeError(`Unknown chan parser: ${parserId}`)
	}
}

export default function createParser(chanSettings, options) {
	if (chanSettings.parser) {
		const Parser = getParser(chanSettings.parser)
		return new Parser(chanSettings, options)
	}
	const createParser = getChanParser(chanSettings.id)
	if (!createParser) {
		throw new RangeError(`Unknown chan: ${chanSettings.id}`)
	}
	return createParser(options)
}