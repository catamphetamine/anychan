import type { DataSource, UserSettings, ChannelFromDataSource } from '@/types'

import getTopChannels from '../getTopChannels.js'
import getChannelsCached from './getChannels.js'

type GetTopChannelsCachedParameters = Parameters<typeof getTopChannels>[0] & {
	dataSource: DataSource,
	userSettings: UserSettings,
	multiDataSource: boolean,
	forceRefresh?: boolean
}

/**
 * Caches `getTopChannels()` result for a day.
 * This is to avoid re-fetching `/top-boards.json` needlessly every time a user opens a page in a new tab
 * because "top channels" are shown in the sidebar.
 */
export default async function getTopChannelsCached({
	dataSource,
	multiDataSource,
	forceRefresh,
	...rest
}: GetTopChannelsCachedParameters): ReturnType<typeof getTopChannels> {
	return await getTopChannels({
		// Can retrieve a list of all channels from the cache.
		getAllChannels: async (): Promise<ChannelFromDataSource[]> => {
			return (await getChannelsCached({
				dataSource,
				multiDataSource,
				forceRefresh,
				...rest
			})).channels
		},
		dataSource,
		...rest
	})
}
