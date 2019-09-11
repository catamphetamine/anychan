// This file only exists for multi-chan applications.

import TwoChanConfig from './2ch/index.json'
import FourChanConfig from './4chan/index.json'
import EightChanConfig from './8ch/index.json'
import KohlChanConfig from './kohlchan/index.json'
import EndChanConfig from './endchan/index.json'
import LainChanConfig from './lainchan/index.json'
import ArisuChanConfig from './arisuchan/index.json'

import TwoChan from './2ch'
import FourChan from './4chan'
import EightChan from './8ch'
import KohlChan from './kohlchan'
import EndChan from './endchan'
import LainChan from './lainchan'
import ArisuChan from './arisuchan'

export function getConfig(chanId) {
	switch (chanId) {
		case '2ch':
			return TwoChanConfig
		case '4chan':
			return FourChanConfig
		case '8ch':
			return EightChanConfig
		case 'kohlchan':
			return KohlChanConfig
		case 'endchan':
			return EndChanConfig
		case 'lainchan':
			return LainChanConfig
		case 'arisuchan':
			return ArisuChanConfig
	}
}

export default function getChan(chanId) {
	switch (chanId) {
		case '2ch':
			return TwoChan
		case '4chan':
			return FourChan
		case '8ch':
			return EightChan
		case 'kohlchan':
			return KohlChan
		case 'endchan':
			return EndChan
		case 'lainchan':
			return LainChan
		case 'arisuchan':
			return ArisuChan
	}
}