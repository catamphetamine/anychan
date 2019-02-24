import { ReduxModule } from 'react-website'

import configuration from '../configuration'
import { getChan } from '../chan'
import getMessages from '../messages'

import { Parser as TwoChannelParser, BOARDS_RESPONSE_EXAMPLE as TWO_CHANNEL_BOARDS_RESPONSE_EXAMPLE } from '../chan-parser/2ch'
import { Parser as FourChanParser } from '../chan-parser/4chan'

const redux = new ReduxModule()

export const getBoards = redux.action(
	() => async http => {
		// Remove this before pushing.
		let response
		// Development process optimization.
		// (public CORS proxies introduce delays)
		if (process.env.NODE_ENV !== 'production' && getBoardsResponseExample(getChan().id)) {
			response = getBoardsResponseExample(getChan().id)
		} else {
			response = await http.get(proxyUrl(getChan().boardsUrl))
		}
		const {
			boards,
			boardsByPopularity,
			boardsByCategory
		} = createParser({}).parseBoards(response)
		return {
			boards,
			boardsByPopularity,
			boardsByCategory
		}
	},
	(state, result) => ({
		...state,
		...result
	})
)

export const getThreads = redux.action(
	(boardId, filters, locale) => async http => {
		const response = await http.get(proxyUrl(
			getChan().threadsUrl.replace('{boardId}', boardId)
		))
		const startedAt = Date.now()
		const threads = createParser({ filters, locale }).parseThreads(response, { boardId })
		console.log(`Threads parsed in ${(Date.now() - startedAt) / 1000} secs`)
		for (const thread of threads) {
			thread.comments[0].commentsCount = thread.commentsCount
			thread.comments[0].attachmentsCount = thread.attachmentsCount
		}
		return {
			boardId,
			threads
		}
	},
	(state, { threads, boardId }) => ({
		...state,
		board: state.boards.find(_ => _.id === boardId),
		threads
	})
)

export const getComments = redux.action(
	(boardId, threadId, filters, locale) => async http => {
		const response = await http.get(proxyUrl(
			getChan().commentsUrl.replace('{boardId}', boardId).replace('{threadId}', threadId)
		))
		const startedAt = Date.now()
		const comments = createParser({ filters, locale }).parseComments(response, { boardId })
		console.log(`Comments parsed in ${(Date.now() - startedAt) / 1000} secs`)
		const subject = comments[0].title
		if (subject) {
			comments[0].title = undefined
		}
		return {
			boardId,
			thread: {
				id: comments[0].id,
				subject,
				comments: [comments[0]]
			},
			comments
		}
	},
	(state, { boardId, thread, comments }) => ({
		...state,
		board: state.boards.find(_ => _.id === boardId),
		thread,
		comments
	})
)

export default redux.reducer()

function createParser({ filters, locale }) {
	const Parser = getParser(getChan().id)
	return new Parser({
		filters,
		messages: locale ? getMessages(locale) : undefined
	})
}

function proxyUrl(url) {
	switch (getChan().id) {
		case '2ch':
			if (configuration.corsProxyUrlAws) {
				return configuration.corsProxyUrlAws.replace('{url}', url)
			}
	}
	if (configuration.corsProxyUrl) {
		return configuration.corsProxyUrl.replace('{url}', url)
	}
	return url
}

function getParser(chan) {
	switch (chan) {
		case '2ch':
			return TwoChannelParser
		case '4chan':
			return FourChanParser
		default:
			throw new Error(`Unknown chan: "${chan}"`)
	}
}

function getBoardsResponseExample(chan) {
	switch (chan) {
		case '2ch':
			return TWO_CHANNEL_BOARDS_RESPONSE_EXAMPLE
	}
}