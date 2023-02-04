import { getConfig } from 'imageboard'

import TwoChannel from './2ch/index.json' assert { type: 'json' }
import FourChan from './4chan/index.json' assert { type: 'json' }
import EightChan from './8ch/index.json' assert { type: 'json' }
import EndChan from './endchan/index.json' assert { type: 'json' }
import KohlChan from './kohlchan/index.json' assert { type: 'json' }
import LainChan from './lainchan/index.json' assert { type: 'json' }
import ArisuChan from './arisuchan/index.json' assert { type: 'json' }

const PROVIDERS = [
	TwoChannel,
	FourChan,
	EightChan,
	EndChan,
	KohlChan,
	LainChan,
	ArisuChan
]

export default PROVIDERS

for (const provider of PROVIDERS) {
	// Get "core" imageboard config.
	// (API URLs, board/thread/comment URLs, etc).
	const imageboardConfig = getConfig(provider.id)

	// provider.imageboard = imageboardConfig
	provider.imageboard = provider.id
	provider.domain = imageboardConfig.domain

	provider.channelUrl = imageboardConfig.boardUrl.replace('{boardId}', '{channelId}')
	provider.threadUrl = imageboardConfig.threadUrl.replace('{boardId}', '{channelId}')
	provider.commentUrl = imageboardConfig.commentUrl.replace('{boardId}', '{channelId}')

	// Create `getChannelUrlPattern()` function on `provider` object.
	// This function is used in `src/provider.js` in `getChannelUrl()` function.
	provider.getChannelUrlPattern = ({ notSafeForWork }) => {
		return `https://${getDomainForBoard({ notSafeForWork }, imageboardConfig)}${
			provider.channelUrl
		}`
	}

	// Create `getThreadUrlPattern()` function on `provider` object.
	// This function is used in `src/provider.js` in `getThreadUrl()` function.
	provider.getThreadUrlPattern = ({ notSafeForWork }) => {
		return `https://${getDomainForBoard({ notSafeForWork }, imageboardConfig)}${
			provider.threadUrl
		}`
	}

	// Create `getCommentUrlPattern()` function on `provider` object.
	// This function is used in `src/provider.js` in `getCommentUrl()` function.
	provider.getCommentUrlPattern = ({ notSafeForWork }) => {
		return `https://${getDomainForBoard({ notSafeForWork }, imageboardConfig)}${
			provider.commentUrl
		}`
	}
}

function getDomainForBoard(boardProperties, config) {
	if (config.domainByBoard) {
		for (const property of Object.keys(boardProperties)) {
			if (config.domainByBoard[property] && boardProperties[property]) {
				return config.domainByBoard[property]
			}
		}
		if (config.domainByBoard['*']) {
			return config.domainByBoard['*']
		}
	}
	return config.domain
}