import {
	getChan,
	getAbsoluteUrl,
	getChanParserSettings
} from '../chan'

import UserData from '../UserData/UserData'
import createParser from './createParser'
import getProxyUrl from './getProxyUrl'
import setThreadInfo from './setThreadInfo'
import configuration from '../configuration'

export default async function getThreads({ boardId, censoredWords, locale, http }) {
	const apiRequestStartedAt = Date.now()
	const response = await http.get(getProxyUrl(
		getAbsoluteUrl(getChanParserSettings().api.getThreads)
			.replace('{boardId}', boardId)
	))
	console.log(`Get threads API request finished in ${(Date.now() - apiRequestStartedAt) / 1000} secs`)
	const startedAt = Date.now()
	const threads = createParser({ censoredWords, locale }).parseThreads(response, {
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
}