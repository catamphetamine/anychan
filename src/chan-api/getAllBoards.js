import {
	getChan,
	getAbsoluteUrl,
	getChanParserSettings
} from '../chan'

import {
	getBoardsResponseExample,
	getBoardsResult
} from './getBoards'

import createParser from './createParser'
import getProxyUrl from './getProxyUrl'

export default async function getAllBoards({ http }) {
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
		response = await http.get(getProxyUrl(getAbsoluteUrl(
			getChanParserSettings().api.getAllBoards || getChanParserSettings().api.getBoards
		)))
	}
	console.log(`Get all boards API request finished in ${(Date.now() - apiRequestStartedAt) / 1000} secs`)
	return getBoardsResult(createParser({}).parseBoards(response))
}