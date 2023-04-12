import { getConfig } from 'imageboard'

import getChannelsApi from '../../src/api/imageboard/getChannels.js'
import getThreadsApi from '../../src/api/imageboard/getThreads.js'
import getThreadApi from '../../src/api/imageboard/getThread.js'
import voteApi from '../../src/api/imageboard/vote.js'
import logInApi from '../../src/api/imageboard/logIn.js'
import logOutApi from '../../src/api/imageboard/logOut.js'
import postApi from '../../src/api/imageboard/post.js'
import reportApi from '../../src/api/imageboard/report.js'

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

	provider.getAbsoluteUrl = (relativeUrl, { notSafeForWork }) => {
		return `https://${getDomainForBoard({ notSafeForWork }, imageboardConfig)}${relativeUrl}`
	}

	provider.api = {
		getChannels: getChannelsApi,
		getThreads: getThreadsApi,
		getThread: getThreadApi
	}

	if (imageboardConfig.api.vote) {
		provider.api.vote = voteApi
	}

	if (imageboardConfig.api.logIn) {
		provider.api.logIn = logInApi
	}

	if (imageboardConfig.api.logOut) {
		provider.api.logOut = logOutApi
	}

	if (imageboardConfig.api.post) {
		provider.api.post = postApi
	}

	if (imageboardConfig.api.report) {
		provider.api.report = reportApi
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