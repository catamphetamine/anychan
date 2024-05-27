// import type { DataSource } from '@/types'

import DATA_SOURCES from './dataSources.js'

// import SomeDataSourceIcon from '../dataSources/some-dataSource/icon.png'

import TwoChannelIcon from '../dataSources/imageboards/2ch/icon.png'
import FourChanIcon from '../dataSources/imageboards/4chan/icon.png'
import EightChanIcon from '../dataSources/imageboards/8ch/icon.png'
import EndChanIcon from '../dataSources/imageboards/endchan/icon.png'
import KohlChanIcon from '../dataSources/imageboards/kohlchan/icon.png'
import LainChanIcon from '../dataSources/imageboards/lainchan/icon.png'
import ArisuChanIcon from '../dataSources/imageboards/arisuchan/icon.png'
import SmugLoliIcon from '../dataSources/imageboards/smugloli/icon.png'
import LeftyPolIcon from '../dataSources/imageboards/leftypol/icon.png'
import TvChanIcon from '../dataSources/imageboards/tvchan/icon.png'
import BandadaIcon from '../dataSources/imageboards/bandada/icon.png'
import WizardChanIcon from '../dataSources/imageboards/wizardchan/icon.png'
import JakpartySoyIcon from '../dataSources/imageboards/jakparty.soy/icon.png'
import JunkuChanIcon from '../dataSources/imageboards/junkuchan/icon.png'
import ZzzChanIcon from '../dataSources/imageboards/zzzchan/icon.png'
import AlogsSpaceIcon from '../dataSources/imageboards/alogs.space/icon.png'
import NinetyFourChanIcon from '../dataSources/imageboards/94chan/icon.png'
import PtChanIcon from '../dataSources/imageboards/ptchan/icon.png'

// type DataSourceWithOptionalLogoAndIcon = Omit<DataSource, 'icon' | 'logo'> & Partial<Pick<DataSource, 'icon' | 'logo'>>

export function addDataSourceIcons() {
	// const DATA_SOURCES = DATA_SOURCES_ as Record<DataSource['id'], DataSourceWithOptionalLogoAndIcon>

	// // Set `.icon` property.
	// // These icon URLs could also be strings inside `index.json` hosted somewhere on a CDN.
	// DATA_SOURCES['some-dataSource'].icon = SomeDataSourceIcon

	// Set `.icon` property.
	// These icon URLs could also be strings inside `index.json` hosted somewhere on a CDN.
	DATA_SOURCES['2ch'].icon = TwoChannelIcon
	DATA_SOURCES['4chan'].icon = FourChanIcon
	DATA_SOURCES['8ch'].icon = EightChanIcon
	DATA_SOURCES['endchan'].icon = EndChanIcon
	DATA_SOURCES['kohlchan'].icon = KohlChanIcon
	DATA_SOURCES['lainchan'].icon = LainChanIcon
	DATA_SOURCES['arisuchan'].icon = ArisuChanIcon
	DATA_SOURCES['smugloli'].icon = SmugLoliIcon
	DATA_SOURCES['leftypol'].icon = LeftyPolIcon
	DATA_SOURCES['tvchan'].icon = TvChanIcon
	DATA_SOURCES['bandada'].icon = BandadaIcon
	DATA_SOURCES['wizardchan'].icon = WizardChanIcon
	DATA_SOURCES['jakparty.soy'].icon = JakpartySoyIcon
	DATA_SOURCES['junkuchan'].icon = JunkuChanIcon
	DATA_SOURCES['zzzchan'].icon = ZzzChanIcon
	DATA_SOURCES['alogs.space'].icon = AlogsSpaceIcon
	DATA_SOURCES['94chan'].icon = NinetyFourChanIcon
	DATA_SOURCES['ptchan'].icon = PtChanIcon
}