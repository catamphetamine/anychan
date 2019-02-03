import { ReduxModule } from 'react-website'

import configuration from '../configuration'
import { getChan } from '../chan'
import getMessages from '../messages'

const redux = new ReduxModule()

export const getBoards = redux.action(
	() => async http => {
		// Remove this before pushing.
		let response
		// Development process optimization.
		// (public CORS proxies introduce delays)
		if (process.env.NODE_ENV !== 'production' && getChan().GET_BOARDS_RESPONSE_EXAMPLE) {
			response = getChan().GET_BOARDS_RESPONSE_EXAMPLE
		} else {
			response = await http.get(proxyUrl(getChan().getBoardsUrl()))
		}
		const {
			boards,
			boardsByCategory
		} = createParser().parseBoards(response)
		return {
			boards,
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
		const response = await http.get(proxyUrl(getChan().getThreadsUrl(boardId)))
		return {
			boardId,
			threads: createParser({ filters, locale, boardId }).parseThreads(response)
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
		const response = await http.get(proxyUrl(getChan().getCommentsUrl(boardId, threadId)))
		// const startedAt = Date.now()
		const comments = createParser({ filters, locale, boardId }).parseComments(response)
		// console.log(`Posts parsed in ${(Date.now() - startedAt) / 1000} secs`)
		return {
			boardId,
			thread: {
				id: comments[0].id,
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

function createParser(options) {
	const Parser = getChan().Parser
	return new Parser({
		...options,
		messages: options ? getMessages(options.locale) : undefined
	})
}

function proxyUrl(url) {
	return configuration.corsProxyUrl.replace('{url}', url)
}