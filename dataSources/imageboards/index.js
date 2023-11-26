import { getConfig } from 'imageboard'

import TwoChannel from './2ch/index.json' assert { type: 'json' }
import FourChan from './4chan/index.json' assert { type: 'json' }
import EightChan from './8ch/index.json' assert { type: 'json' }
import EndChan from './endchan/index.json' assert { type: 'json' }
import KohlChan from './kohlchan/index.json' assert { type: 'json' }
import LainChan from './lainchan/index.json' assert { type: 'json' }
import ArisuChan from './arisuchan/index.json' assert { type: 'json' }
import NinetyFourChan from './94chan/index.json' assert { type: 'json' }
import PtChan from './ptchan/index.json' assert { type: 'json' }

import addDataSourceApiFunctions from './addDataSourceApiFunctions.js'

// When adding a new imageboard here, also set its `icon` and `logo`
// in `./src/dataSourceLogos.js`.
const DATA_SOURCES = [
	TwoChannel,
	FourChan,
	EightChan,
	EndChan,
	KohlChan,
	LainChan,
	ArisuChan,
	NinetyFourChan,
	PtChan
]

export default DATA_SOURCES

for (const dataSource of DATA_SOURCES) {
	addDataSourceApiFunctions(dataSource)

	const imageboardConfig = getConfig(dataSource.id)

	dataSource.supportsCreateThread = () => imageboardConfig.engine === 'makaba' || dataSource.id === '4chan'
	dataSource.supportsCreateComment = () => imageboardConfig.engine === 'makaba' || dataSource.id === '4chan'
	dataSource.supportsReportComment = () => imageboardConfig.engine === 'makaba' || dataSource.id === '4chan'
	dataSource.supportsLogIn = () => imageboardConfig.engine === 'makaba' || dataSource.id === '4chan'
	dataSource.supportsVote = () => imageboardConfig.engine === 'makaba'
	dataSource.supportsGetCaptcha = () => imageboardConfig.engine === 'makaba' || dataSource.id === '4chan'

	dataSource.hasLogInTokenPassword = () => dataSource.id === '4chan'
}