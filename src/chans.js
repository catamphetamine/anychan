import TwoChannelIcon from '../chan/2ch/icon.png'
import FourChanIcon from '../chan/4chan/icon.png'
import EightChanIcon from '../chan/8ch/icon.png'
import KohlChanIcon from '../chan/kohlchan/icon.png'
import LainChanIcon from '../chan/lainchan/icon.png'

import TwoChannelLogo from '../chan/2ch/logo.svg'
import FourChanLogo from '../chan/4chan/logo.svg'
import EightChanLogo from '../chan/8ch/logo.svg'
import KohlChanLogo from '../chan/kohlchan/logo.png'
import LainChanLogo from '../chan/lainchan/logo.svg'

import TwoChannel from '../chan/2ch'
import FourChan from '../chan/4chan'
import EightChan from '../chan/8ch'
import KohlChan from '../chan/kohlchan'
import LainChan from '../chan/lainchan'

export default [
	TwoChannel,
	FourChan,
	EightChan,
	KohlChan,
	LainChan
]

// These URLs could also be strings inside `index.json` hosted somewhere on a CDN.
TwoChannel.icon = TwoChannelIcon
FourChan.icon = FourChanIcon
EightChan.icon = EightChanIcon
KohlChan.icon = KohlChanIcon
LainChan.icon = LainChanIcon

TwoChannel.logo = TwoChannelLogo
FourChan.logo = FourChanLogo
EightChan.logo = EightChanLogo
KohlChan.logo = KohlChanLogo
LainChan.logo = LainChanLogo
