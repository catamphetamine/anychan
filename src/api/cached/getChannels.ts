// import type { DataSource, UserSettings, GetChannelsParameters } from '@/types'

import getChannels from '../getChannels.js'
import { get } from './cache.js'

type GetChannelsCachedParameters = Parameters<typeof getChannels>[0] & {
	multiDataSource: boolean,
	forceRefresh?: boolean
}

/**
 * Caches `getChannels()` result for a day.
 * This is to avoid re-fetching `/boards.json` needlessly every time it is used
 * to get "top channels" or when searching for channels.
 */
export default async function getChannelsCached({
	dataSource,
	multiDataSource,
	forceRefresh,
	...rest
}: GetChannelsCachedParameters): ReturnType<typeof getChannels> {
	return await get(
		'channels',
		() => getChannels({
			...rest,
			dataSource
		}),
		dataSource,
		multiDataSource,
		forceRefresh
	)
}
