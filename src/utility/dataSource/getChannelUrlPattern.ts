import type { DataSource } from '@/types'

import getDataSourceAbsoluteUrl from './getDataSourceAbsoluteUrl.js'

export default function getChannelUrlPattern(
	dataSource: DataSource,
	{ channelContainsExplicitContent }: { channelContainsExplicitContent: boolean }
) {
	return getDataSourceAbsoluteUrl(dataSource, dataSource.channelUrl, { channelContainsExplicitContent })
}