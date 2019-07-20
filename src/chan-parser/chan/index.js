// This file only exists for multi-chan applications.

import TwoChannel from './2ch/index.json'
import FourChannel from './4chan/index.json'
import EightChannel from './8ch/index.json'
import EndChan from './endchan/index.json'
import KohlChan from './kohlchan/index.json'
import LainChan from './lainchan/index.json'
import ArisuChan from './arisuchan/index.json'

const CHANS = [
	TwoChannel,
	FourChannel,
	EightChannel,
	EndChan,
	KohlChan,
	LainChan,
	ArisuChan
]

export default function getChan(id) {
	for (const chan of CHANS) {
		if (chan.id === id) {
			return chan
		}
	}
}