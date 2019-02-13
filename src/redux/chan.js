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
			boardsByPopularity,
			boardsByCategory
		} = await createParser({}).parseBoards(response)
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
		const response = await http.get(proxyUrl(getChan().getThreadsUrl(boardId)))
		// const startedAt = Date.now()
		const threads = await createParser({ filters, locale }).parseThreads(response, { boardId })
		for (const thread of threads) {
			thread.comments[0].commentsCount = thread.commentsCount
			thread.comments[0].attachmentsCount = thread.attachmentsCount
		}
		return {
			boardId,
			threads
		}
		// console.log(`Threads parsed in ${(Date.now() - startedAt) / 1000} secs`)
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
		const comments = await createParser({ filters, locale }).parseComments(response, { boardId })
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

function createParser({ filters, locale }) {
	const Parser = getChan().Parser
	return new Parser({
		filters,
		youTubeApiKey: configuration.youTubeApiKey,
		messages: locale ? getMessages(locale) : undefined
	})
}

function proxyUrl(url) {
	return configuration.corsProxyUrl.replace('{url}', url)
}