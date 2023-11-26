import Imageboard_, { getConfig } from 'imageboard'

import Imageboard from '../../src/api/imageboard/Imageboard.js'
import getProxyUrl from '../../src/utility/proxy/getProxyUrl.js'

import getChannelsApi from '../../src/api/imageboard/getChannels.js'
import getThreadsApi from '../../src/api/imageboard/getThreads.js'
import getThreadApi from '../../src/api/imageboard/getThread.js'
import voteForCommentApi from '../../src/api/imageboard/voteForComment.js'
import reportCommentApi from '../../src/api/imageboard/reportComment.js'
import logInApi from '../../src/api/imageboard/logIn.js'
import logOutApi from '../../src/api/imageboard/logOut.js'
import createThreadApi from '../../src/api/imageboard/createThread.js'
import createCommentApi from '../../src/api/imageboard/createComment.js'
import getCaptchaApi from '../../src/api/imageboard/getCaptcha.js'

import { getCookie, deleteCookie } from 'frontend-lib/utility/cookies.js'

export default function addDataSourceApiFunctions(dataSource) {
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
		dataSource.api.voteForComment = voteForCommentApi
	}

	if (imageboardConfig.api.logIn) {
		dataSource.api.logIn = logInApi
	}

	if (imageboardConfig.api.logOut) {
		dataSource.api.logOut = logOutApi
	}

	if (imageboardConfig.api.post) {
		dataSource.api.createComment = createCommentApi
	}

	if (imageboardConfig.api.post) {
		dataSource.api.createThread = createThreadApi
	}

	if (imageboardConfig.api.getCaptcha) {
		dataSource.api.getCaptcha = getCaptchaApi
	}

	if (imageboardConfig.api.report) {
		dataSource.api.reportComment = reportCommentApi
	}

	dataSource.supportsFeature = (feature) => {
		return Imageboard_(dataSource.id).supportsFeature(feature)
	}

	// function addDataSourceParameterToFunction(func) {
	// 	return (parameters) => func({
	// 		dataSource,
	// 		...parameters
	// 	})
	// }

	function addImageboardArgumentToFunction(func) {
		return ({
			http,
			messages,
			userSettings,
			...parameters
		}) => {
			// Validate function parameters.
			if (!http) {
				throw new Error('`http` parameter is required')
			}
			if (!messages) {
				throw new Error('`messages` parameter is required')
			}
			if (!userSettings) {
				throw new Error('`userSettings` parameter is required')
			}

			// Create imageboard instance.
			const imageboard = Imageboard(dataSource, {
				http,
				messages,
				getProxyUrl() {
					// `proxyUrl: null` could mean "don't use any proxy".
					return getProxyUrl({ userSettings })
				}
			})

			// Call the function with `imageboard` argument.
			return func(imageboard, parameters)
		}
	}

	// Add `dataSource` parameter to each `api` function.
	for (const functionName of Object.keys(dataSource.api)) {
		dataSource.api[functionName] = addImageboardArgumentToFunction(dataSource.api[functionName])
	}

	// const { accessTokenCookieName, authenticatedCookieName } = imageboardConfig
	// if (accessTokenCookieName) {
	// 	dataSource.readAccessTokenFromCookie = () => {
	// 		return getCookie(accessTokenCookieName)
	// 	}
	// 	dataSource.clearAuthCookies = () => {
	// 		deleteCookie(accessTokenCookieName)
	// 		if (authenticatedCookieName) {
	// 			deleteCookie(authenticatedCookieName)
	// 		}
	// 	}
	// }

	// if (imageboardConfig.api.getCaptchaFrame) {
	// 	dataSource.getCaptchaFrameUrl = ({ channelId, threadId }) => {
	// 		return imageboardConfig.api.getCaptchaFrame.url
	// 			.replace('{boardId}', channelId)
	// 			.replace('{threadId}', threadId)
	// 	}
	// }
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