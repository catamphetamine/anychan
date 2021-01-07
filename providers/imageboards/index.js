// An undocumented `getConfig()` export path.
import getConfig from 'imageboard/commonjs/chan/getConfig'

import TwoChannel from './2ch'
import FourChan from './4chan'
import EightChan from './8ch'
import EndChan from './endchan'
import KohlChan from './kohlchan'
import LainChan from './lainchan'
import ArisuChan from './arisuchan'

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
	const imageboardConfig = getConfig(provider.id)
	// provider.imageboard = imageboardConfig
	provider.imageboard = provider.id
	provider.domain = imageboardConfig.domain
	provider.getThreadUrl = ({ channelId, threadId, isNotSafeForWork }) => {
		return `https://${getDomainForBoard({ isNotSafeForWork }, imageboardConfig)}${
			imageboardConfig.threadUrl
				.replace('{boardId}', channelId)
				.replace('{threadId}', threadId)
		}`
	}
	provider.getCommentUrl = ({ channelId, threadId, commentId, isNotSafeForWork }) => {
		return `https://${getDomainForBoard({ isNotSafeForWork }, imageboardConfig)}${
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