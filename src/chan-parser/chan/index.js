// This file only exists for multi-chan applications.

import TwoChannel from './2ch/index.json'
import FourChannel from './4chan/index.json'
import EightChannel from './8ch/index.json'
import KohlChan from './kohlchan/index.json'
import EndChan from './endchan/index.json'
import LainChan from './lainchan/index.json'
import ArisuChan from './arisuchan/index.json'

import TwoChannelParser from './2ch'
import FourChannelParser from './4chan'
import EightChannelParser from './8ch'
import KohlChanParser from './kohlchan'
import EndChanParser from './endchan'
import LainChanParser from './lainchan'
import ArisuChanParser from './arisuchan'

export function getChanSettings(chanId) {
	switch (chanId) {
		case '2ch':
			return TwoChannel
		case '4chan':
			return FourChannel
		case '8ch':
			return EightChannel
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

export function getChanParser(chanId) {
	switch (chanId) {
		case '2ch':
			return TwoChannelParser
		case '4chan':
			return FourChannelParser
		case '8ch':
			return EightChannelParser
		case 'kohlchan':
			return KohlChanParser
		case 'endchan':
			return EndChanParser
		case 'lainchan':
			return LainChanParser
		case 'arisuchan':
			return ArisuChanParser
	}
}