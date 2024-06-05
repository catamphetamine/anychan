import type { DataSource, UserSettings, GetChannelsParameters, GetChannelsResult, ChannelFromDataSource } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js';

/**
 * Returns a list of all channels.
 */
export default async function getChannels({
	locale,
	originalDomain,
	dataSource,
	userSettings
}: {
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<GetChannelsParameters, 'proxyUrl'>): Promise<GetChannelsResult> {
	return await dataSource.api.getChannels({
		locale,
		originalDomain,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})
}
