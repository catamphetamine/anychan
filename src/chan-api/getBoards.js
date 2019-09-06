import {
	getChan,
	getAbsoluteUrl,
	getChanParserSettings
} from '../chan'

import createParser from './createParser'
import getProxyUrl from './getProxyUrl'
import groupBoardsByCategory from '../chan-parser/groupBoardsByCategory'

export default async function getBoards({ http, all }) {
	// Most chans don't provide `/boards.json` API
	// so their boards list is defined as a static one in JSON configuration.
	if (getChan().boards) {
		return getBoardsResult(getChan().boards)
	}
	// The API endpoint URL.
	const url = all ?
		getChanParserSettings().api.getAllBoards || getChanParserSettings().api.getBoards :
		getChanParserSettings().api.getBoards
	// Validate configuration
	if (!url) {
		throw new Error(`Neither "boards" nor "api.getBoards" were found in chan or \`chan-parser\` config`)
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
		response = await http.get(getProxyUrl(getAbsoluteUrl(url)))
	}
	console.log(`Get ${all ? 'all ' : ''}boards API request finished in ${(Date.now() - apiRequestStartedAt) / 1000} secs`)
	const result = getBoardsResult(createParser({}).parseBoards(response, {
		hideBoardCategories: all ? undefined : getChan().hideBoardCategories
	}))
	if (all) {
		// Set a flag that this is the full list of boards.
		result.allBoards = true
	}
	return result
}

export function getBoardsResponseExample(chan) {
	switch (chan) {
		case '2ch':
			return window.TWO_CHANNEL_BOARDS_RESPONSE_EXAMPLE
	}
}

export function getBoardsResult(boards) {
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
