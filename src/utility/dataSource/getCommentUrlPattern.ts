import type { DataSource } from '@/types'

import getDataSourceAbsoluteUrl from './getDataSourceAbsoluteUrl.js'

export default function getCommentUrlPattern(
	dataSource: DataSource,
	{ channelContainsExplicitContent }: { channelContainsExplicitContent: boolean }
) {
	return getDataSourceAbsoluteUrl(dataSource, dataSource.commentUrl, { channelContainsExplicitContent })
}