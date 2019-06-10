import TwoChannelParser from '../2ch/Parser'
import FourChannelParser from '../4chan/Parser'

export default function createChanParser(chanIdOrChanSettings, options) {
	let parserId
	if (typeof chanIdOrChanSettings === 'string') {
		parserId = getChanParserId(chanIdOrChanSettings)
	} else {
		parserId = options.parser
	}
	const Parser = getChanParser(chanIdOrChanSettings)
	return new Parser(chanIdOrChanSettings, options)
}

function getChanParserId(chan) {
	switch (chan) {
		case '2ch':
			return '2ch'
		case '4chan':
		case '8ch':
		case 'kohlchan':
			return '4chan'
		default:
			throw new TypeError(`Unknown chan: ${chan}`)
	}
}

function getChanParser(parserId) {
	switch (parserId) {
		case '2ch':
			return TwoChannelParser
		case '4chan':
			return FourChannelParser
		default:
			throw new TypeError(`Unknown chan parser: ${parserId}`)
	}
}