import TwoChannel from '../chan/2ch'
import FourChan from '../chan/4chan'
import EightChan from '../chan/8ch'
import EndChan from '../chan/endchan'
import KohlChan from '../chan/kohlchan'
import LainChan from '../chan/lainchan'
import ArisuChan from '../chan/arisuchan'

import TwoChannelIcon from '../chan/2ch/icon.png'
import FourChanIcon from '../chan/4chan/icon.png'
import EightChanIcon from '../chan/8ch/icon.png'
import EndChanIcon from '../chan/endchan/icon.png'
import KohlChanIcon from '../chan/kohlchan/icon.png'
import LainChanIcon from '../chan/lainchan/icon.png'
import ArisuChanIcon from '../chan/arisuchan/icon.png'

import TwoChannelLogo from '../chan/2ch/logo.svg'
import FourChanLogo from '../chan/4chan/logo.svg'
import EightChanLogo from '../chan/8ch/logo.svg'
import EndChanLogo from '../chan/endchan/logo.png'
import KohlChanLogo from '../chan/kohlchan/logo.png'
import LainChanLogo from '../chan/lainchan/logo.svg'
import ArisuChanLogo from '../chan/arisuchan/logo.svg'

export default [
	TwoChannel,
	FourChan,
	EightChan,
	EndChan,
	KohlChan,
	LainChan,
	ArisuChan
]

// These URLs could also be strings inside `index.json` hosted somewhere on a CDN.
TwoChannel.icon = TwoChannelIcon
FourChan.icon = FourChanIcon
EightChan.icon = EightChanIcon
EndChan.icon = EndChanIcon
KohlChan.icon = KohlChanIcon
LainChan.icon = LainChanIcon
ArisuChan.icon = ArisuChanIcon

TwoChannel.logo = TwoChannelLogo
FourChan.logo = FourChanLogo
EightChan.logo = EightChanLogo
EndChan.logo = EndChanLogo
KohlChan.logo = KohlChanLogo
LainChan.logo = LainChanLogo
ArisuChan.logo = ArisuChanLogo
