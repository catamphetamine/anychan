import type { DataSource } from '@/types'

import getDataSourceAbsoluteUrl from './getDataSourceAbsoluteUrl.js'

export default function getThreadUrlPattern(
	dataSource: DataSource,
	{ notSafeForWork }: {
		notSafeForWork: boolean
	}
) {
	// if (dataSource.getThreadUrlPattern) {
	// 	return dataSource.getThreadUrlPattern({ notSafeForWork })
	// }
	return getDataSourceAbsoluteUrl(dataSource, dataSource.threadUrl, { notSafeForWork })
}
