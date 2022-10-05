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
	provider.getThreadUrl = ({ channelId, threadId, notSafeForWork }) => {
		return `https://${getDomainForBoard({ notSafeForWork }, imageboardConfig)}${
			imageboardConfig.threadUrl
				.replace('{boardId}', channelId)
				.replace('{threadId}', threadId)
		}`
	}
	provider.getCommentUrl = ({ channelId, threadId, commentId, notSafeForWork }) => {
		return `https://${getDomainForBoard({ notSafeForWork }, imageboardConfig)}${
			imageboardConfig.commentUrl
				.replace('{boardId}', channelId)
				.replace('{threadId}', threadId)
				.replace('{commentId}', commentId)
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