import DATA_SOURCES from './dataSources.js'

// import SomeDataSourceIcon from '../dataSources/some-dataSource/icon.png'
// import SomeDataSourceLogo from '../dataSources/some-dataSource/logo.svg'

import TwoChannelIcon from '../dataSources/imageboards/2ch/icon.png'
import FourChanIcon from '../dataSources/imageboards/4chan/icon.png'
import EightChanIcon from '../dataSources/imageboards/8ch/icon.png'
import EndChanIcon from '../dataSources/imageboards/endchan/icon.png'
import KohlChanIcon from '../dataSources/imageboards/kohlchan/icon.png'
import LainChanIcon from '../dataSources/imageboards/lainchan/icon.png'
import ArisuChanIcon from '../dataSources/imageboards/arisuchan/icon.png'
import NinetyFourChanIcon from '../dataSources/imageboards/94chan/icon.png'
import PtChanIcon from '../dataSources/imageboards/ptchan/icon.png'

import TwoChannelLogo from '../dataSources/imageboards/2ch/logo.svg'
import FourChanLogo from '../dataSources/imageboards/4chan/logo.svg'
import EightChanLogo from '../dataSources/imageboards/8ch/logo.svg'
import EndChanLogo from '../dataSources/imageboards/endchan/logo.png'
import KohlChanLogo from '../dataSources/imageboards/kohlchan/logo.png'
import LainChanLogo from '../dataSources/imageboards/lainchan/logo.svg'
import ArisuChanLogo from '../dataSources/imageboards/arisuchan/logo.svg'
import NinetyFourChanLogo from '../dataSources/imageboards/94chan/logo.svg'
import PtChanLogo from '../dataSources/imageboards/ptchan/logo.svg'

export function addDataSourceLogos() {
	// // Set `.icon` property.
	// // These icon URLs could also be strings inside `index.json` hosted somewhere on a CDN.
	// DATA_SOURCES['some-dataSource'].icon = SomeDataSourceIcon

	// // Set `.logo` property.
	// // In this case, the `logo`s are React SVG elements.
	// // A `logo` could also be a URL.
	// DATA_SOURCES['some-dataSource'].logo = SomeDataSourceLogo

	// Set `.icon` property.
	// These icon URLs could also be strings inside `index.json` hosted somewhere on a CDN.
	DATA_SOURCES['2ch'].icon = TwoChannelIcon
	DATA_SOURCES['4chan'].icon = FourChanIcon
	DATA_SOURCES['8ch'].icon = EightChanIcon
	DATA_SOURCES['endchan'].icon = EndChanIcon
	DATA_SOURCES['kohlchan'].icon = KohlChanIcon
	DATA_SOURCES['lainchan'].icon = LainChanIcon
	DATA_SOURCES['arisuchan'].icon = ArisuChanIcon
	DATA_SOURCES['94chan'].icon = NinetyFourChanIcon
	DATA_SOURCES['ptchan'].icon = PtChanIcon

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
	DATA_SOURCES['94chan'].logo = NinetyFourChanLogo
	DATA_SOURCES['ptchan'].logo = PtChanLogo
}