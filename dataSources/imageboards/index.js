import Imageboard, { getConfig } from 'imageboard'

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

const DATA_SOURCES = [
	TwoChannel,
	FourChan,
	EightChan,
	EndChan,
	KohlChan,
	LainChan,
	ArisuChan
]

export default DATA_SOURCES

for (const dataSource of DATA_SOURCES) {
	// Get "core" imageboard config.
	// (API URLs, board/thread/comment URLs, etc).
	const imageboardConfig = getConfig(dataSource.id)

	// dataSource.imageboard = imageboardConfig
	dataSource.imageboard = dataSource.id
	dataSource.domain = imageboardConfig.domain

	dataSource.channelUrl = imageboardConfig.boardUrl.replace('{boardId}', '{channelId}')
	dataSource.threadUrl = imageboardConfig.threadUrl.replace('{boardId}', '{channelId}')
	dataSource.commentUrl = imageboardConfig.commentUrl.replace('{boardId}', '{channelId}')

	dataSource.getAbsoluteUrl = (relativeUrl, { notSafeForWork }) => {
		return `https://${getDomainForBoard({ notSafeForWork }, imageboardConfig)}${relativeUrl}`
	}

	dataSource.api = {
		getChannels: getChannelsApi,
		getThreads: getThreadsApi,
		getThread: getThreadApi
	}

	if (imageboardConfig.api.vote) {
		dataSource.api.vote = voteApi
	}

	if (imageboardConfig.api.logIn) {
		dataSource.api.logIn = logInApi
	}

	if (imageboardConfig.api.logOut) {
		dataSource.api.logOut = logOutApi
	}

	if (imageboardConfig.api.post) {
		dataSource.api.post = postApi
	}

	if (imageboardConfig.api.report) {
		dataSource.api.report = reportApi
	}

	dataSource.supportsFeature = (feature) => {
		return Imageboard(dataSource.id).supportsFeature(feature)
	}

	function addDataSourceParameterToFunction(func) {
		return (parameters) => func({
			dataSource,
			...parameters
		})
	}

	// Add `dataSource` parameter to each `api` function.
	for (const functionName of Object.keys(dataSource.api)) {
		dataSource.api[functionName] = addDataSourceParameterToFunction(dataSource.api[functionName])
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