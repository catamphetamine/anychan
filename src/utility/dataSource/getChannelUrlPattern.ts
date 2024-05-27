import type { DataSource } from '@/types'

import getDataSourceAbsoluteUrl from './getDataSourceAbsoluteUrl.js'

export default function getChannelUrlPattern(dataSource: DataSource, { notSafeForWork }: { notSafeForWork: boolean }) {
	// if (dataSource.getChannelUrlPattern) {
	// 	return dataSource.getChannelUrlPattern({ notSafeForWork })
	// }
	return getDataSourceAbsoluteUrl(dataSource, dataSource.channelUrl, { notSafeForWork })
}