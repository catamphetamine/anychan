import { ReduxModule } from 'react-website'

import { Parser as DvachParser } from '../chan-parser/2ch'
import { Parser as FourChanParser } from '../chan-parser/4chan'

import { getChan } from '../chan'

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
			response = await http.get('chan://boards.json')
		}
		const {
			boardsBySpeed,
			boardsByCategory
		} = createParser().parseBoards(response)
		return {
			boardsBySpeed,
			boardsByCategory
		}
	},
	(state, result) => ({
		...state,
		...result
	})
)

export const getThreads = redux.action(
	(boardId, page, filters) => async http => {
		const response = await http.get(`chan://${boardId}/catalog.json`)
		// const startedAt = Date.now()
		const {
			board,
			threads,
			pagesCount
		} = createParser({ filters }).parseThreads(response)
		// console.log(`Threads parsed in ${(Date.now() - startedAt) / 1000} secs`)
		return {
			board,
			threads,
			threadsPage: page,
			threadsPagesCount: pagesCount
		}
	},
	(state, result) => ({
		...state,
		...result
	})
)

export const getComments = redux.action(
	(boardId, threadId, filters) => async http => {
		const response = await http.get(`chan://${boardId}/res/${threadId}.json`)
		// const startedAt = Date.now()
		const {
			board,
			thread,
			comments
		} = createParser({ filters }).parseComments(response)
		// console.log(`Posts parsed in ${(Date.now() - startedAt) / 1000} secs`)
		return {
			board,
			thread,
			comments
		}
	},
	(state, result) => ({
		...state,
		...result
	})
)

export default redux.reducer()

function getParser() {
	switch (getChan().id) {
		case '2ch':
			return DvachParser
		case '4chan':
			return FourChanParser
		default:
			throw new Error(`Unknown chan: ${getChan().id}`)
	}
}

function createParser(options) {
	const Parser = getParser()
	return new Parser(options)
}