// Exports a list of providers indexed by provider id.
// Also, sets `.icon` and `.logo` for each provider.

import PROVIDERS_LIST from '../providers'

// import SomeProviderIcon from '../providers/some-provider/icon.png'
// import SomeProviderLogo from '../providers/some-provider/logo.svg'

import TwoChannelIcon from '../providers/imageboards/2ch/icon.png'
import FourChanIcon from '../providers/imageboards/4chan/icon.png'
import EightChanIcon from '../providers/imageboards/8ch/icon.png'
import EndChanIcon from '../providers/imageboards/endchan/icon.png'
import KohlChanIcon from '../providers/imageboards/kohlchan/icon.png'
import LainChanIcon from '../providers/imageboards/lainchan/icon.png'
import ArisuChanIcon from '../providers/imageboards/arisuchan/icon.png'

import TwoChannelLogo from '../providers/imageboards/2ch/logo.svg'
import FourChanLogo from '../providers/imageboards/4chan/logo.svg'
import EightChanLogo from '../providers/imageboards/8ch/logo.svg'
import EndChanLogo from '../providers/imageboards/endchan/logo.png'
import KohlChanLogo from '../providers/imageboards/kohlchan/logo.png'
import LainChanLogo from '../providers/imageboards/lainchan/logo.svg'
import ArisuChanLogo from '../providers/imageboards/arisuchan/logo.svg'

// Create an index of all supported providers.
const PROVIDERS = PROVIDERS_LIST.reduce((index, provider) => {
	index[provider.id] = provider
	if (provider.aliases) {
		for (const alias of provider.aliases) {
			index[alias] = provider
		}
	}
	return index
}, {})

// // Set `.icon` property.
// // These icon URLs could also be strings inside `index.json` hosted somewhere on a CDN.
// PROVIDERS['some-provider'].icon = SomeProviderIcon

// // Set `.logo` property.
// // In this case, the `logo`s are React SVG elements.
// // A `logo` could also be a URL.
// PROVIDERS['some-provider'].logo = SomeProviderLogo

// Set `.icon` property.
// These icon URLs could also be strings inside `index.json` hosted somewhere on a CDN.
PROVIDERS['2ch'].icon = TwoChannelIcon
PROVIDERS['4chan'].icon = FourChanIcon
PROVIDERS['8ch'].icon = EightChanIcon
PROVIDERS['endchan'].icon = EndChanIcon
PROVIDERS['kohlchan'].icon = KohlChanIcon
PROVIDERS['lainchan'].icon = LainChanIcon
PROVIDERS['arisuchan'].icon = ArisuChanIcon

// Set `.logo` property.
// In this case, the `logo`s are React SVG elements.
// A `logo` could also be a URL.
PROVIDERS['2ch'].logo = TwoChannelLogo
PROVIDERS['4chan'].logo = FourChanLogo
PROVIDERS['8ch'].logo = EightChanLogo
PROVIDERS['endchan'].logo = EndChanLogo
PROVIDERS['kohlchan'].logo = KohlChanLogo
PROVIDERS['lainchan'].logo = LainChanLogo
PROVIDERS['arisuchan'].logo = ArisuChanLogo

// Add "8kun" alias to "8ch".
PROVIDERS['8ch'].aliases = ['8kun']

// Exports an index of all supported providers.
export default PROVIDERS