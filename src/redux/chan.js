import { ReduxModule } from 'react-website'

import configuration from '../configuration'
import {
	getChan,
	getAbsoluteUrl,
	getChanParserSettings,
	isDeployedOnChanDomain,
	getProxyUrl
} from '../chan'
import getMessages from '../messages'
import getUrl from '../utility/getUrl'
import UserData from '../UserData/UserData'

// import EIGHT_CHAN_BOARDS_RESPONSE from '../../chan/8ch/boards.json'
import createParser, { getChanSettings } from '../chan-parser'
import groupBoardsByCategory from '../chan-parser/groupBoardsByCategory'
import createByIdIndex from '../utility/createByIdIndex'

import getPostText from 'webapp-frontend/src/utility/post/getPostText'
import trimText from 'webapp-frontend/src/utility/post/trimText'

const redux = new ReduxModule()

export const getBoards = redux.action(
	() => async http => {
		// Most chans don't provide `/boards.json` API
		// so their boards list is defined as a static one in JSON configuration.
		if (getChan().boards) {
			return getBoardsResult(getChan().boards)
		}
		// Validate configuration
		if (!getChanParserSettings().api.getBoards) {
			throw new Error(`Neither "boards" nor "api.getBoards" were found in chan or chan-parser config`)
		}
		const apiRequestStartedAt = Date.now()
		let response
		// Using the "Top 20 boards" endpoint instead.
		// https://8ch.net/boards-top20.json
		// // `8ch.net` has too many boards (about 20 000).
		// // Displaying just the top of the list
		// if (getChan().id === '8ch') {
		// 	response = EIGHT_CHAN_BOARDS_RESPONSE
		// }
		// Development process optimization: use a cached list of `2ch.hk` boards.
		// (to aviod the delay caused by a CORS proxy)
		if (process.env.NODE_ENV !== 'production' && getBoardsResponseExample(getChan().id)) {
			response = getBoardsResponseExample(getChan().id)
		} else {
			response = await http.get(proxyUrl(getAbsoluteUrl(getChanParserSettings().api.getBoards)))
		}
		console.log(`Get boards API request finished in ${(Date.now() - apiRequestStartedAt) / 1000} secs`)
		return getBoardsResult(createChanParser({}).parseBoards(response, {
			hideBoardCategories: getChan().hideBoardCategories
		}))
	},
	(state, result) => ({
		...state,
		...result
	})
)

export const getAllBoards = redux.action(
	() => async http => {
		// Most chans don't provide `/boards.json` API
		// so their boards list is defined as a static one in JSON configuration.
		if (getChan().boards) {
			return getBoardsResult(getChan().boards)
		}
		const apiRequestStartedAt = Date.now()
		let response
		// Development process optimization: use a cached list of `2ch.hk` boards.
		// (to aviod the delay caused by a CORS proxy)
		if (process.env.NODE_ENV !== 'production' && getBoardsResponseExample(getChan().id)) {
			response = getBoardsResponseExample(getChan().id)
		} else {
			response = await http.get(proxyUrl(getAbsoluteUrl(
				getChanParserSettings().api.getAllBoards || getChanParserSettings().api.getBoards
			)))
		}
		console.log(`Get all boards API request finished in ${(Date.now() - apiRequestStartedAt) / 1000} secs`)
		return getBoardsResult(createChanParser({}).parseBoards(response))
	},
	(state, result) => ({
		...state,
		allBoards: result
	})
)

export const getThreads = redux.action(
	(boardId, censoredWords, locale) => async http => {
		const apiRequestStartedAt = Date.now()
		const response = await http.get(proxyUrl(
			getAbsoluteUrl(getChanParserSettings().api.getThreads)
				.replace('{boardId}', boardId)
		))
		console.log(`Get threads API request finished in ${(Date.now() - apiRequestStartedAt) / 1000} secs`)
		const startedAt = Date.now()
		const threads = createChanParser({ censoredWords, locale }).parseThreads(response, {
			boardId,
			// Can parse the list of threads up to 4x faster without parsing content.
			// Example: when parsing content — 130 ms, when not parsing content — 20 ms.
			parseContent: false,
			commentLengthLimit: configuration.commentLengthLimitForThreadPreview
		})
		console.log(`Threads parsed in ${(Date.now() - startedAt) / 1000} secs`)
		for (const thread of threads) {
			setThreadInfo(thread, 'thread')
		}
		// Clear expired threads from user data.
		UserData.updateThreads(boardId, threads)
		return {
			boardId,
			threads
		}
	},
	(state, { boardId, threads }) => ({
		...state,
		threads,
		// `8ch.net` has too many boards (20 000) so they're not parsed.
		// For `8ch.net` `boards` contains only a small amount of most active boards.
		board: state.boards.find(_ => _.id === boardId) || { id: boardId, name: boardId }
	})
)

export const getThread = redux.action(
	(boardId, threadId, censoredWords, locale) => async http => {
		const apiRequestStartedAt = Date.now()
		const response = await http.get(proxyUrl(
			getAbsoluteUrl(getChanParserSettings().api.getThread)
				.replace('{boardId}', boardId)
				.replace('{threadId}', threadId)
		))
		console.log(`Get thread API request finished in ${(Date.now() - apiRequestStartedAt) / 1000} secs`)
		const startedAt = Date.now()
		const thread = createChanParser({ censoredWords, locale }).parseThread(response, {
			boardId,
			// Can parse thread comments up to 4x faster without parsing content.
			// Example: when parsing content — 650 ms, when not parsing content — 200 ms.
			parseContent: false,
			commentLengthLimit: configuration.commentLengthLimit
		})
		// Generate text preview which is used for `<meta description/>` on the thread page.
		generateTextPreview(thread.comments[0], getMessages(locale))
		console.log(`Thread parsed in ${(Date.now() - startedAt) / 1000} secs`)
		// // Move thread title from the first comment to the thread object.
		// const title = thread.comments[0].title
		// if (title) {
		// 	thread.comments[0].title = undefined
		// }
		setThreadInfo(thread, 'comment')
		return {
			boardId,
			thread: {
				...thread,
				// title
			}
		}
	},
	(state, { boardId, thread }) => {
		// `8ch.net` has too many boards (20 000) so they're not parsed.
		// For `8ch.net` `boards` contains only a small amount of most active boards.
		const board = state.boards.find(_ => _.id === boardId) || { id: boardId, name: boardId }
		// 2ch.hk doesn't specify the limits in board settings themselves.
		// Instead, it returns the limits as part of "get thread" API response.
		if (thread.maxCommentLength) {
			// Maximum allowed comment length.
			board.maxCommentLength = thread.maxCommentLength
			delete thread.maxCommentLength
			// Maximum allowed attachments size.
			board.maxAttachmentsSize = thread.maxAttachmentsSize
			delete thread.maxAttachmentsSize
		}
		return {
			...state,
			board,
			thread
		}
	}
)

export default redux.reducer()

function createChanParser({ censoredWords, locale }) {
	return createParser(
		getChanParserSettings(),
		{
			censoredWords,
			addOnContentChange: true,
			expandReplies: true,
			messages: locale ? getMessages(locale) : undefined,
			useRelativeUrls: isDeployedOnChanDomain(),
			getUrl
		}
	)
}

function proxyUrl(url) {
	if (!getChan().proxy) {
		return url
	}
	const proxyUrl = getProxyUrl()
	if (proxyUrl) {
		return proxyUrl.replace('{url}', url)
	}
	return url
}

function getBoardsResponseExample(chan) {
	switch (chan) {
		case '2ch':
			return window.TWO_CHANNEL_BOARDS_RESPONSE_EXAMPLE
	}
}

function setThreadInfo(thread, mode) {
	thread.comments[0].commentsCount = thread.commentsCount
	thread.comments[0].commentAttachmentsCount = thread.commentAttachmentsCount
	thread.comments[0].uniquePostersCount = thread.uniquePostersCount
	// `isRootComment` is used for showing full-size attachment thumbnail
	// on main thread posts on `4chan.org`.
	thread.comments[0].isRootComment = true
	// `isBumpLimitReached`, `isSticky` and others are used for post header badges.
	thread.comments[0].isBumpLimitReached = thread.isBumpLimitReached
	thread.comments[0].isSticky = thread.isSticky
	thread.comments[0].isRolling = thread.isRolling
	thread.comments[0].isLocked = thread.isLocked
	// Set viewing mode (board, thread).
	for (const comment of thread.comments) {
		comment.mode = mode
	}
	// Set "thread shows author IDs" flag.
	const hasAuthorIds = thread.comments.some(comment => comment.authorId)
	if (hasAuthorIds) {
		for (const comment of thread.comments) {
			comment.threadHasAuthorIds = true
		}
	}
}

function getBoardsResult(boards) {
	const result = {
		boards
	}
	if (boards[0].commentsPerHour) {
		result.boardsByPopularity = boards.slice().sort((a, b) => b.commentsPerHour - a.commentsPerHour)
	}
	if (boards[0].category) {
		result.boardsByCategory = groupBoardsByCategory(
			boards.filter(board => !board.isHidden),
			getChan().boardCategories
		)
	}
	return result
}

/**
 * Generates a text preview of a comment.
 * Text preview is used for `<meta description/>`.
 * @param {object} comment
 * @return {string} [preview]
 */
function generateTextPreview(comment, messages) {
	const textPreview = getPostText(
		comment.content,
		comment.attachments,
		{
			ignoreAttachments: true,
			softLimit: 150,
			messages: messages.contentTypes
		}
	)
	if (textPreview) {
		comment.textPreview = trimText(textPreview, 150)
	}
}