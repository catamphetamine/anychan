import TwoChannel from './2ch/index.json' assert { type: 'json' }
import FourChan from './4chan/index.json' assert { type: 'json' }
import EightChan from './8ch/index.json' assert { type: 'json' }
import EndChan from './endchan/index.json' assert { type: 'json' }
import KohlChan from './kohlchan/index.json' assert { type: 'json' }
import LainChan from './lainchan/index.json' assert { type: 'json' }
import ArisuChan from './arisuchan/index.json' assert { type: 'json' }
import SmugLoli from './smugloli/index.json' assert { type: 'json' }
import LeftyPol from './leftypol/index.json' assert { type: 'json' }
import TvChan from './tvchan/index.json' assert { type: 'json' }
import Bandada from './bandada/index.json' assert { type: 'json' }
import WizardChan from './wizardchan/index.json' assert { type: 'json' }
import JakpartySoy from './jakparty.soy/index.json' assert { type: 'json' }
import JunkuChan from './junkuchan/index.json' assert { type: 'json' }
import ZzzChan from './zzzchan/index.json' assert { type: 'json' }
import AlogsSpace from './alogs.space/index.json' assert { type: 'json' }
import NinetyFourChan from './94chan/index.json' assert { type: 'json' }
import PtChan from './ptchan/index.json' assert { type: 'json' }

// Add alias: "8kun" → "8ch".
// The reason is that I consider "8ch" a better name.
// @ts-expect-error
EightChan.aliases = ['8kun']

// Add alias: "alogsspace" → "alogs.space".
// The reason is that an HTTP request to `http://localhost:1234/alogs.space`
// attempts to search for a file and returns "Not Found".
// To work around that, `http://localhost:1234/alogsspace` URL is used instead
// when developing the application on a local machine.
// @ts-expect-error
AlogsSpace.aliases = ['alogsspace']

// Add alias: "jakpartysoy" → "jakparty.soy".
// The reason is that an HTTP request to `http://localhost:1234/jakparty.soy`
// attempts to search for a file and returns "Not Found".
// To work around that, `http://localhost:1234/jakpartysoy` URL is used instead
// when developing the application on a local machine.
// @ts-expect-error
JakpartySoy.aliases = ['jakpartysoy']

// When adding a new imageboard here, also set its `icon` and `logo`
// in `./src/dataSourceLogos.js`.
export default [
	TwoChannel,
	FourChan,
	EightChan,
	KohlChan,
	EndChan,
	LainChan,
	ArisuChan,
	TvChan,
	SmugLoli,
	LeftyPol,
	Bandada,
	WizardChan,
	JakpartySoy,
	JunkuChan,
	ZzzChan,
	AlogsSpace,
	NinetyFourChan,
	PtChan
] as const