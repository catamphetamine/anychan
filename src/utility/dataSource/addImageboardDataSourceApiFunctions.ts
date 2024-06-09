import type { Channel, DataSource, DataSourceFeature, Locale } from '@/types'
import type { ImageboardConfig, ImageboardId } from 'imageboard'

import { getConfig, supportsFeature } from 'imageboard'

import Imageboard from '../../api/imageboard/Imageboard.js'

import getChannelsApi from '../../api/imageboard/getChannels.js'
import getTopChannelsApi from '../../api/imageboard/getTopChannels.js'
import findChannelsApi from '../../api/imageboard/findChannels.js'
import getThreadsApi from '../../api/imageboard/getThreads.js'
import getThreadApi from '../../api/imageboard/getThread.js'
import rateCommentApi from '../../api/imageboard/rateComment.js'
import reportCommentApi from '../../api/imageboard/reportComment.js'
import logInApi from '../../api/imageboard/logIn.js'
import logOutApi from '../../api/imageboard/logOut.js'
import createThreadApi from '../../api/imageboard/createThread.js'
import createCommentApi from '../../api/imageboard/createComment.js'
import getCaptchaApi from '../../api/imageboard/getCaptcha.js'

import getMessages from '../../messages/getMessages.js'

export default function addImageboardDataSourceApiFunctions(dataSource: Partial<DataSource>) {
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

	dataSource.getAbsoluteUrl = (relativeUrl, { channelContainsExplicitContent }) => {
		return `https://${getDomainForBoard({ channelContainsExplicitContent }, imageboardConfig)}${relativeUrl}`
	}

	const apis: Partial<Record<keyof DataSource['api'], Function>> = {
		getChannels: getChannelsApi,
		getThreads: getThreadsApi,
		getThread: getThreadApi
	}

	if (supportsFeature(imageboardId, 'getTopBoards')) {
		apis.getTopChannels = getTopChannelsApi
	}

	if (supportsFeature(imageboardId, 'findBoards')) {
		apis.findChannels = findChannelsApi
	}

	// `endchan` runs on an old version of `lynxchan` engine that doesn't provide
	// an API endpoint to get a list of all boards but it provides an API endpoint to get a list of "top" boards.
	// In such cases, `getTopBoards()` API simply substitutes for `getBoards()` API.
	if (!supportsFeature(imageboardId, 'getBoards') && supportsFeature(imageboardId, 'getTopBoards')) {
		apis.getChannels = async (...args: Parameters<typeof getChannelsApi>) => {
			const { channels } = await apis.getTopChannels(...args)
			return { channels, hasMoreChannels: false }
		}
	}

	if (supportsFeature(imageboardId, 'rateComment')) {
		apis.rateComment = rateCommentApi
	}

	if (supportsFeature(imageboardId, 'logIn') && (
		imageboardConfig.engine === 'makaba' ||
		dataSource.id === '4chan'
	)) {
		apis.logIn = logInApi
	}

	if (supportsFeature(imageboardId, 'logOut')) {
		apis.logOut = logOutApi
	}

	if (supportsFeature(imageboardId, 'createComment')) {
		apis.createComment = createCommentApi
	}

	if (supportsFeature(imageboardId, 'createThread')) {
		apis.createThread = createThreadApi
	}

	if (supportsFeature(imageboardId, 'getCaptcha')) {
		apis.getCaptcha = getCaptchaApi
	}

	if (supportsFeature(imageboardId, 'reportComment')) {
		apis.reportComment = reportCommentApi
	}

	if (imageboardConfig.captchaRules) {
		dataSource.isCaptchaRequired = ({
			channel,
			isAuthenticated
		}: {
			channel: Channel,
			isAuthenticated: boolean
		}) => {
			if (!isAuthenticated) {
				if (channel && channel.post.captchaRequired) {
					return true
				}
			}
		}
	}

	dataSource.supportsFeature = (feature: DataSourceFeature) => {
		switch (feature) {
			case 'getThread.withLatestComments':
			case 'getThreads.sortByRatingDesc':
			case 'logIn.tokenPassword':
				return supportsFeature(imageboardId, feature)
			default:
				throw new Error(`Unknown data source feature: ${feature}`)
		}
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
				'updateComment',
				'updateThread',
				'rateComment',
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
}

function getDomainForBoard({
	channelContainsExplicitContent
}: {
	channelContainsExplicitContent?: boolean
}, config: ImageboardConfig) {
	if (config.domainByBoard) {
		if (config.domainByBoard['<nsfw>']) {
			if (channelContainsExplicitContent) {
				return config.domainByBoard['<nsfw>']
			}
		}
		if (config.domainByBoard['*']) {
			return config.domainByBoard['*']
		}
	}
	return config.domain
}