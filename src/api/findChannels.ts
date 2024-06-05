import type { DataSource, UserSettings, FindChannelsParameters, FindChannelsResult, ChannelFromDataSource } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js';

/**
 * Returns a list of all channels.
 */
export default async function findChannels({
	getAllChannels,
	search,
	maxCount,
	locale,
	originalDomain,
	dataSource,
	userSettings
}: {
	getAllChannels?: () => Promise<ChannelFromDataSource[]>,
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<FindChannelsParameters, 'proxyUrl'>): Promise<FindChannelsResult> {
	const proxyUrl = getProxyUrl({ dataSource, userSettings })

	// If `findChannels()` API is available, use it.
	if (dataSource.api.findChannels) {
		return await dataSource.api.findChannels({
			search,
			maxCount,
			locale,
			originalDomain,
			proxyUrl
		})
	}

	// If `findChannels()` API is not available, emulate it with `getChannels()` API:
	// * Get all channels.
	// * Search in those channels.

	// A cached list of `channels` can be passed, in which case it won't be re-fetched.
	// Otherwise, a list of `channels` should be fetched.
	let channels: ChannelFromDataSource[]
	if (getAllChannels) {
		channels = await getAllChannels()
	} else if (dataSource.api.getChannels) {
		// If there's "get all channels" API then its output could be used for the search.
		channels = (await dataSource.api.getChannels({
			locale,
			originalDomain,
			proxyUrl
		})).channels
	} else if (dataSource.api.getTopChannels) {
		// If there's "get top channels" API then its output could be used for the search
		// in case there're no other options. The list of search results won't be complete in that case.
		channels = (await dataSource.api.getTopChannels({
			locale,
			originalDomain,
			proxyUrl
		})).channels
	} else {
		// If there's no API to fetch a list of channels, assume it's empty.
		channels = []
	}

	// Search is case-insensitive.
	search = search.toLowerCase()

	// Search by the `search` query in the list of `channels`.
	const allMatchedChannels = channels.filter((channel) => {
		return channel.id.toLowerCase().includes(search) ||
			channel.title.toLowerCase().includes(search)
	})

	let matchedChannels = allMatchedChannels

	// Apply `maxCount` parameter.
	if (typeof maxCount === 'number') {
		matchedChannels = matchedChannels.slice(0, maxCount)
	}

	return {
		channels: matchedChannels,
		hasMoreChannels: matchedChannels.length < allMatchedChannels.length
	}
}