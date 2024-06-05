import type { DataSource, UserSettings, GetTopChannelsParameters, GetTopChannelsResult, ChannelFromDataSource } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js';

/**
 * Returns a list of "top" channels.
 */
export default async function getTopChannels({
	maxCount,
	getAllChannels,
	locale,
	originalDomain,
	dataSource,
	userSettings
}: {
	getAllChannels?: () => Promise<ChannelFromDataSource[]>,
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<GetTopChannelsParameters, 'proxyUrl'>): Promise<GetTopChannelsResult> {
	const proxyUrl = getProxyUrl({ dataSource, userSettings })

	// If `getTopChannels()` API is available, use it.
	if (dataSource.api.getTopChannels) {
		return await dataSource.api.getTopChannels({
			locale,
			originalDomain,
			proxyUrl
		})
	}

	// If `findChannels()` API is not available, emulate it with `getChannels()` API:
	// * Get all channels.
	// * Get "top" channels from those channels.

	// A cached list of `channels` can be passed, in which case it won't be re-fetched.
	// Otherwise, a list of `channels` should be fetched.
	let channels: ChannelFromDataSource[]
	if (getAllChannels) {
		channels = await getAllChannels()
	} else if (dataSource.api.getChannels) {
		channels = (await dataSource.api.getChannels({
			locale,
			originalDomain,
			proxyUrl
		})).channels
	} else {
		// If there's no API to fetch a list of channels, assume it's empty.
		channels = []
	}

	// Mark hidden channels.
	let topChannels: PossiblyHiddenChannel[] = markHiddenChannels(channels, { dataSource })

	// Filter out hidden channels.
	topChannels = topChannels.filter(_ => !_.isHidden)

	// If each `channel` has `commentsPerHour` property then sort channels by "popularity":
	// from most popular to least popular.
	if (topChannels.length > 0) {
		if (topChannels[0].commentsPerHour) {
			topChannels = topChannels.slice().sort((a, b) => b.commentsPerHour - a.commentsPerHour)
		}
	}

	if (typeof maxCount === 'number') {
		topChannels = topChannels.slice(0, maxCount)
	}

	return {
		channels: topChannels
	}
}

interface PossiblyHiddenChannel extends ChannelFromDataSource {
	isHidden?: boolean;
}

function markHiddenChannels(
	channels: ChannelFromDataSource[],
	{ dataSource }: { dataSource: DataSource }
): PossiblyHiddenChannel[] {
	const contentCategoryHidden = dataSource.contentCategoryHidden
	if (contentCategoryHidden) {
		return channels.map((channel) => {
			if (channel.category === contentCategoryHidden) {
				// Special case for `2ch.hk`'s `/int/` board which happens to be
				// in the ignored category but shouldn't be hidden.
				if (dataSource.id === '2ch' && channel.id === 'int') {
					return channel
				}
				return {
					...channel,
					isHidden: true
				}
			}
			return channel
		})
	}
	return channels
}