import type { DataSource } from '@/types'

import getDataSourceAbsoluteUrl from './getDataSourceAbsoluteUrl.js'

export default function getCommentUrlPattern(dataSource: DataSource, { notSafeForWork }: { notSafeForWork: boolean }) {
	// if (dataSource.getCommentUrl) {
	// 	return dataSource.getCommentUrl({ notSafeForWork })
	// }
	return getDataSourceAbsoluteUrl(dataSource, dataSource.commentUrl, { notSafeForWork })
}