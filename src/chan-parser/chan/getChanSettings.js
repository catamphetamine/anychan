import TwoChannel from './2ch'
import FourChannel from './4chan'
import EightChannel from './8ch'
import KohlChan from './kohlchan'

export default function getChanSettings(chan) {
	switch (chan) {
		case '2ch':
			return TwoChannel
		case '4chan':
			return FourChannel
		case '8ch':
			return EightChannel
		case 'kohlchan':
			return KohlChan
		default:
			throw new TypeError(`Unknown chan: ${chan}`)
	}
}