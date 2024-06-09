import type { DataSource } from '@/types'

import getDataSourceAbsoluteUrl from './getDataSourceAbsoluteUrl.js'

export default function getThreadUrlPattern(
	dataSource: DataSource,
	{ channelContainsExplicitContent }: { channelContainsExplicitContent: boolean }
) {
	return getDataSourceAbsoluteUrl(dataSource, dataSource.threadUrl, { channelContainsExplicitContent })
}
