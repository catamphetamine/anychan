import { ReduxModule } from 'react-website'

import configuration from '../configuration'
import { getChan, shouldUseRelativeUrls } from '../chan'
import getMessages from '../messages'
import getUrl from '../utility/getUrl'
import UserData from '../utility/UserData'

// import EIGHT_CHAN_BOARDS_RESPONSE from '../../chan/8ch/boards.json'
import createParser from '../chan-parser'
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
			response = await http.get(proxyUrl(addOrigin(getChan().boardsUrl)))
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
			response = await http.get(proxyUrl(addOrigin(getChan().allBoardsUrl || getChan().boardsUrl)))
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
	(boardId, filters, locale) => async http => {
		const apiRequestStartedAt = Date.now()
		const response = await http.get(proxyUrl(
			addOrigin(getChan().threadsUrl).replace('{boardId}', boardId)
		))
		console.log(`Get threads API request finished in ${(Date.now() - apiRequestStartedAt) / 1000} secs`)
		const startedAt = Date.now()
		const threads = createChanParser({ filters, locale }).parseThreads(response, {
			boardId,
			// Can parse the list of threads up to 4x faster without parsing content.
			// Example: when parsing content — 130 ms, when not parsing content — 20 ms.
			parseContent: false
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
	(state, { threads, boardId }) => ({
		...state,
		// `8ch.net` has too many boards (20 000) so they're not parsed.
		// For `8ch.net` `boards` contains only a small amount of most active boards.
		board: state.boards.find(_ => _.id === boardId) || { id: boardId, name: boardId },
		threads
	})
)

export const getThread = redux.action(
	(boardId, threadId, filters, locale) => async http => {
		const apiRequestStartedAt = Date.now()
		const response = await http.get(proxyUrl(
			addOrigin(getChan().commentsUrl).replace('{boardId}', boardId).replace('{threadId}', threadId)
		))
		console.log(`Get thread API request finished in ${(Date.now() - apiRequestStartedAt) / 1000} secs`)
		const startedAt = Date.now()
		const thread = createChanParser({ filters, locale }).parseThread(response, {
			boardId,
			// Can parse thread comments up to 4x faster without parsing content.
			// Example: when parsing content — 650 ms, when not parsing content — 200 ms.
			parseContent: false,
			expandContent: true
		})
		// Generate text preview which is used for `<meta description/>` on the thread page.
		generateTextPreview(thread.comments[0])
		console.log(`Thread parsed in ${(Date.now() - startedAt) / 1000} secs`)
		// // Move thread subject from the first comment to the thread object.
		// const subject = thread.comments[0].title
		// if (subject) {
		// 	thread.comments[0].title = undefined
		// }
		setThreadInfo(thread, 'comment')
		return {
			boardId,
			thread: {
				...thread,
				// subject
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

function createChanParser({ filters, locale }) {
	return createParser(getChan().id, {
		filters,
		commentLengthLimit: configuration.commentLengthLimit,
		addOnContentChange: true,
		expandReplies: true,
		messages: locale ? getMessages(locale) : undefined,
		useRelativeUrls: shouldUseRelativeUrls(),
		getUrl
	})
}

function proxyUrl(url) {
	if (!getChan().proxy) {
		return url
	}
	if (getChan().proxy.aws) {
		if (configuration.corsProxyUrlAws) {
			return configuration.corsProxyUrlAws.replace('{url}', url)
		}
	}
	if (configuration.corsProxyUrl) {
		return configuration.corsProxyUrl.replace('{url}', url)
	}
	return url
}

function getBoardsResponseExample(chan) {
	switch (chan) {
		case '2ch':
			return window.TWO_CHANNEL_BOARDS_RESPONSE_EXAMPLE
	}
}

/**
 * Adds HTTP origin to a possibly relative URL.
 * For example, if this application is deployed on 2ch.hk domain
 * then there's no need to query `https://2ch.hk/...` URLs
 * and instead relative URLs `/...` should be queried.
 * This function checks whether the application should use
 * relative URLs and transforms the URL accordingly.
 */
function addOrigin(url) {
	if (url[0] === '/') {
		if (!shouldUseRelativeUrls(url)) {
			url = getChan().website + url
		}
	}
	return url
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
function generateTextPreview(comment) {
	const textPreview = getPostText(
		comment.content,
		comment.attachments,
		{
			ignoreAttachments: true,
			softLimit: 150
		}
	)
	if (textPreview) {
		comment.textPreview = trimText(textPreview, 150)
	}
}