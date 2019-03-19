import { ReduxModule } from 'react-website'

import configuration from '../configuration'
import { getChan, shouldUseRelativeUrls } from '../chan'
import getMessages from '../messages'
import getUrl from '../utility/getUrl'

// import EIGHT_CHAN_BOARDS_RESPONSE from '../../chan/8ch/boards.json'
import { Parser as TwoChannelParser, BOARDS_RESPONSE_EXAMPLE as TWO_CHANNEL_BOARDS_RESPONSE_EXAMPLE } from '../chan-parser/2ch'
import { Parser as FourChanParser } from '../chan-parser/4chan'
import groupBoardsByCategory from '../chan-parser/groupBoardsByCategory'

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
		return getBoardsResult(createParser({}).parseBoards(response, {
			boardCategoriesExclude: getChan().boardCategoriesExclude
		}))
	},
	(state, result) => ({
		...state,
		...result
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
		const threads = createParser({ filters, locale }).parseThreads(response, { boardId })
		console.log(`Threads parsed in ${(Date.now() - startedAt) / 1000} secs`)
		for (const thread of threads) {
			setThreadStats(thread)
			setAuthorIds(thread, getMessages(locale))
		}
		// `kohlchan.net` has a bug when thumbnail file extension is random.
		if (getChan().id === 'kohlchan') {
			await Promise.all(
				threads
					.map(thread => thread.comments[0])
					.reduce((all, comment) => all.concat(comment.attachments), [])
					.map(fixKohlChanThumbnailExtension)
			)
		}
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
		const thread = createParser({ filters, locale }).parseThread(response, { boardId })
		console.log(`Thread parsed in ${(Date.now() - startedAt) / 1000} secs`)
		// Move thread subject from the first comment to the thread object.
		const subject = thread.comments[0].title
		if (subject) {
			thread.comments[0].title = undefined
		}
		setThreadStats(thread)
		setAuthorIds(thread, getMessages(locale))
		thread.comments
		// `kohlchan.net` has a bug when thumbnail file extension is random.
		if (getChan().id === 'kohlchan') {
			await Promise.all(
				thread.comments
					.reduce((all, comment) => all.concat(comment.attachments), [])
					.map(fixKohlChanThumbnailExtension)
			)
		}
		return {
			boardId,
			thread: {
				...thread,
				subject
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

function createParser({ filters, locale }) {
	const Parser = getParser()
	return new Parser({
		...getChan().parserOptions,
		chan: getChan().id,
		filters,
		commentLengthLimit: 700,
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

function getParser() {
	switch (getChan().parser) {
		case '2ch':
			return TwoChannelParser
		case '4chan':
			return FourChanParser
		default:
			throw new Error(`Unknown chan parser: "${getChan().parser}"`)
	}
}

function getBoardsResponseExample(chan) {
	switch (chan) {
		case '2ch':
			return TWO_CHANNEL_BOARDS_RESPONSE_EXAMPLE
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

// `kohlchan.net` has a bug when thumbnail file extension is random.
async function fixKohlChanThumbnailExtension(attachment) {
	let size
	if (attachment.type === 'picture') {
		size = attachment.picture.sizes[0]
	} else if (attachment.type === 'video') {
		size = attachment.video.picture.sizes[0]
	} else {
		return
	}
	try {
		await prefetchImage(size.url)
	} catch (error) {
		const url = getAnotherImageUrl(size.url)
		try {
			await prefetchImage(url)
			size.url = url
		} catch (error) {
			// No thumbnail found.
			// Maybe too much load on the server.
		}
	}
}

const JPG_EXTENSION = /\.jpg$/
const PNG_EXTENSION = /\.png$/

function getAnotherImageUrl(url) {
	if (JPG_EXTENSION.test(url)) {
		return url.replace(JPG_EXTENSION, '.png')
	} else if (PNG_EXTENSION.test(url)) {
		return url.replace(PNG_EXTENSION, '.jpg')
	}
}

// Preloads an image before displaying it.
function prefetchImage(url) {
	return new Promise((resolve, reject) => {
		const image = new Image()
		// image.onload = () => setTimeout(resolve, 1000)
		image.onload = resolve
		image.onerror = (event) => {
			if (event.path && event.path[0]) {
				console.error(`Image not found: ${event.path[0].src}`)
			}
			reject(event)
		}
		image.src = url
	})
}

function setThreadStats(thread) {
	thread.comments[0].commentsCount = thread.commentsCount
	thread.comments[0].commentAttachmentsCount = thread.commentAttachmentsCount
	thread.comments[0].uniquePostersCount = thread.uniquePostersCount
}

function setAuthorIds(thread, messages) {
	for (const comment of thread.comments) {
		// Prepend "authorId" to "author name".
		// `authorId` (if present) is an IP address hash.
		if (comment.authorId) {
			if (comment.authorName) {
				comment.authorName = comment.authorId + ' ' + comment.authorName
			} else {
				comment.authorName = comment.authorId
			}
		}
		// Display "trip code" as second "author name".
		if (comment.tripCode) {
			comment.authorName2 = comment.tripCode
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
			// Special case for `2ch.hk`'s `/int/` board which is in the ignored category.
			boards.filter(board => !board.isHidden && board.id !== 'int'),
			getChan().boardCategories
		)
	}
	return result
}