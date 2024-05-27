import type { DataSource, Locale } from '@/types'

import Imageboard_, { getConfig, ImageboardConfig, ImageboardFeature, ImageboardId } from 'imageboard'

import Imageboard from '../../src/api/imageboard/Imageboard.js'
import createHttpRequestFunction from '../../src/api/imageboard/createHttpRequestFunction.js'

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

import getMessages from '../../src/messages/getMessages.js'

export default function addDataSourceApiFunctions(dataSource: Partial<DataSource>) {
	// Added this assignment to fix TypeScript errors.
	const imageboardId = dataSource.id as ImageboardId

	// Get "core" imageboard config.
	// (API URLs, board/thread/comment URLs, etc).
	const imageboardConfig = getConfig(imageboardId)

	// dataSource.imageboard = imageboardConfig
	dataSource.imageboard = imageboardId
	dataSource.domain = imageboardConfig.domain

	dataSource.channelUrl = imageboardConfig.boardUrl.replace('{boardId}', '{channelId}')
	dataSource.threadUrl = imageboardConfig.threadUrl.replace('{boardId}', '{channelId}')
	dataSource.commentUrl = imageboardConfig.commentUrl.replace('{boardId}', '{channelId}')

	dataSource.getAbsoluteUrl = (relativeUrl, { notSafeForWork }) => {
		return `https://${getDomainForBoard({ notSafeForWork }, imageboardConfig)}${relativeUrl}`
	}

	const apis: Partial<Record<keyof DataSource['api'], Function>> = {
		getChannels: getChannelsApi,
		getThreads: getThreadsApi,
		getThread: getThreadApi
	}

	if (imageboardConfig.api.vote) {
		apis.voteForComment = voteForCommentApi
	}

	if (imageboardConfig.api.logIn) {
		apis.logIn = logInApi
	}

	if (imageboardConfig.api.logOut) {
		apis.logOut = logOutApi
	}

	if (imageboardConfig.api.post) {
		apis.createComment = createCommentApi
	}

	if (imageboardConfig.api.post) {
		apis.createThread = createThreadApi
	}

	if (imageboardConfig.api.getCaptcha) {
		apis.getCaptcha = getCaptchaApi
	}

	if (imageboardConfig.api.report) {
		apis.reportComment = reportCommentApi
	}

	if (imageboardConfig.captchaRules) {
		dataSource.isCaptchaRequired = ({
			action,
			isAuthenticated
		}) => {
			if (!isAuthenticated) {
				if (imageboardConfig.captchaRules.includes(`anonymous:${action}:required`)) {
					return true
				}
			}
		}
	}

	dataSource.supportsFeature = (feature: ImageboardFeature) => {
		return Imageboard_(imageboardId, {
			request: createHttpRequestFunction()
		}).supportsFeature(feature)
	}

	// function addDataSourceParameterToFunction(func) {
	// 	return (parameters) => func({
	// 		dataSource,
	// 		...parameters
	// 	})
	// }

	function addImageboardArgumentToFunction(func: Function, functionName: string) {
		return ({
			locale,
			proxyUrl,
			originalDomain,
			...parameters
		}: {
			locale?: Locale,
			proxyUrl?: string,
			originalDomain?: string
		}) => {
			const IMAGEBOARD_FUNCTIONS_THAT_DONT_USE_MESSAGES = [
				'createComment',
				'createThread',
				'voteForComment',
				'reportComment',
				'logIn',
				'logOut'
			]

			// Validate function parameters.
			if (!IMAGEBOARD_FUNCTIONS_THAT_DONT_USE_MESSAGES.includes(functionName)) {
				if (!locale) {
					throw new Error('`locale` parameter is required in `imageboard` package when calling read-only API')
				}
			}

			// Create imageboard instance.
			// It didn't create an imageboard instance outside of this function (at the top level)
			// because there were no `messages` or `userSettings` there. The reason is that
			// the top-level function is called at the application startup time, before
			// user settings have been initialized.
			const imageboard = Imageboard(imageboardConfig, {
				messages: locale ? getMessages(locale) : undefined,
				proxyUrl,
				originalDomain
			})

			// Call the function with `imageboard` argument.
			return func(imageboard, parameters)
		}
	}

	// @ts-expect-error
	dataSource.api = {}

	// Add `dataSource` parameter to each `api` function.
	for (const functionName of Object.keys(apis) as Array<keyof typeof apis>) {
		// I dunno what the TypeScript error is about. Too complicated, didn't read it.
		// @ts-ignore
		dataSource.api[functionName] = addImageboardArgumentToFunction(apis[functionName], functionName)
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

interface BoardProperties {
	notSafeForWork?: boolean;
}

function getDomainForBoard(boardProperties: BoardProperties, config: ImageboardConfig) {
	if (config.domainByBoard) {
		for (const property of Object.keys(boardProperties) as Array<keyof typeof boardProperties>) {
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