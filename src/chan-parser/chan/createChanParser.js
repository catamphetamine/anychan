import TwoChannelParser from '../2ch/Parser'
import FourChannelParser from '../4chan/Parser'
import LynxChanParser from '../lynxchan/Parser'

export default function createChanParser(chanIdOrChanSettings, options) {
	let chanId
	let parserId
	if (typeof chanIdOrChanSettings === 'string') {
		chanId = chanIdOrChanSettings
		parserId = getChanParserId(chanIdOrChanSettings)
	} else {
		chanId = chanIdOrChanSettings.id
		parserId = chanIdOrChanSettings.parser
	}
	const Parser = getChanParser(parserId)
	return new Parser(chanId, options)
}

function getChanParserId(chan) {
	switch (chan) {
		case '2ch':
			return '2ch'
		case '4chan':
		case '8ch':
			return '4chan'
		case 'kohlchan':
			return 'lynxchan'
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
		case 'lynxchan':
			return LynxChanParser
		default:
			throw new TypeError(`Unknown chan parser: ${parserId}`)
	}
}