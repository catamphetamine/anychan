import type { ChannelFromDataSource, DataSource, UserSettings } from '@/types'

import findChannels from '../findChannels.js'
import getChannelsCached from './getChannels.js'
import getTopChannelsCached from './getTopChannels.js'

type FindChannelsCachedParameters = Parameters<typeof findChannels>[0] & {
	dataSource: DataSource,
	userSettings: UserSettings,
	multiDataSource: boolean,
	forceRefresh?: boolean
}

/**
 * Uses a cached result returned from `getChannels()` to implement `findChannels()` API
 * in cases when the data source doesn't provide a `findChannels()` API.
 */
export default async function findChannelsCached({
	dataSource,
	multiDataSource,
	forceRefresh,
	...rest
}: FindChannelsCachedParameters): ReturnType<typeof findChannels> {
	return await findChannels({
		// Can retrieve a list of all channels from the cache.
		getAllChannels: dataSource.api.getChannels || dataSource.api.getTopChannels ? (
			async (): Promise<ChannelFromDataSource[]> => {
				return (dataSource.api.getChannels
					? await getChannelsCached({
						dataSource,
						multiDataSource,
						forceRefresh,
						...rest
					})
					: await getTopChannelsCached({
						dataSource,
						multiDataSource,
						forceRefresh,
						...rest
					})
				).channels
			}
		) : undefined,
		dataSource,
		...rest
	})
}
