// import type { DataSource } from '@/types'

import DATA_SOURCES from './dataSources.js'

// import SomeDataSourceLogo from '../dataSources/some-dataSource/logo.svg'

import TwoChannelLogo from '../dataSources/imageboards/2ch/logo.svg'
import FourChanLogo from '../dataSources/imageboards/4chan/logo.svg'
import EightChanLogo from '../dataSources/imageboards/8ch/logo.svg'
import EndChanLogo from '../dataSources/imageboards/endchan/logo.png'
import KohlChanLogo from '../dataSources/imageboards/kohlchan/logo.png'
import LainChanLogo from '../dataSources/imageboards/lainchan/logo.svg'
import ArisuChanLogo from '../dataSources/imageboards/arisuchan/logo.svg'
import SmugLoliLogo from '../dataSources/imageboards/smugloli/logo.svg'
import LeftyPolLogo from '../dataSources/imageboards/leftypol/logo.png'
import TvChanLogo from '../dataSources/imageboards/tvchan/logo.svg'
import BandadaLogo from '../dataSources/imageboards/bandada/logo.png'
import WizardChanLogo from '../dataSources/imageboards/wizardchan/logo.png'
import JakpartySoyLogo from '../dataSources/imageboards/jakparty.soy/logo.png'
import JunkuChanLogo from '../dataSources/imageboards/junkuchan/logo.svg'
import ZzzChanLogo from '../dataSources/imageboards/zzzchan/logo.svg'
import AlogsSpaceLogo from '../dataSources/imageboards/alogs.space/logo.svg'
import NinetyFourChanLogo from '../dataSources/imageboards/94chan/logo.svg'
import PtChanLogo from '../dataSources/imageboards/ptchan/logo.svg'

// type DataSourceWithOptionalLogo = Omit<DataSource, 'logo'> & Partial<Pick<DataSource, 'logo'>>

export function addDataSourceLogos() {
	// const DATA_SOURCES = DATA_SOURCES_ as Record<DataSource['id'], DataSourceWithOptionalLogo>

	// // Set `.logo` property.
	// // In this case, the `logo`s are React SVG elements.
	// // A `logo` could also be a URL.
	// DATA_SOURCES['some-dataSource'].logo = SomeDataSourceLogo

	// Set `.logo` property.
	// In this case, the `logo`s are React SVG elements.
	// A `logo` could also be a URL.
	DATA_SOURCES['2ch'].logo = TwoChannelLogo
	DATA_SOURCES['4chan'].logo = FourChanLogo
	DATA_SOURCES['8ch'].logo = EightChanLogo
	DATA_SOURCES['endchan'].logo = EndChanLogo
	DATA_SOURCES['kohlchan'].logo = KohlChanLogo
	DATA_SOURCES['lainchan'].logo = LainChanLogo
	DATA_SOURCES['arisuchan'].logo = ArisuChanLogo
	DATA_SOURCES['smugloli'].logo = SmugLoliLogo
	DATA_SOURCES['leftypol'].logo = LeftyPolLogo
	DATA_SOURCES['tvchan'].logo = TvChanLogo
	DATA_SOURCES['bandada'].logo = BandadaLogo
	DATA_SOURCES['wizardchan'].logo = WizardChanLogo
	DATA_SOURCES['jakparty.soy'].logo = JakpartySoyLogo
	DATA_SOURCES['junkuchan'].logo = JunkuChanLogo
	DATA_SOURCES['zzzchan'].logo = ZzzChanLogo
	DATA_SOURCES['alogs.space'].logo = AlogsSpaceLogo
	DATA_SOURCES['94chan'].logo = NinetyFourChanLogo
	DATA_SOURCES['ptchan'].logo = PtChanLogo
}