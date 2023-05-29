import getDataSourceAbsoluteUrl from './getDataSourceAbsoluteUrl.js'

export default function getCommentUrlPattern(dataSource, { notSafeForWork }) {
	// if (dataSource.getCommentUrl) {
	// 	return dataSource.getCommentUrl({ notSafeForWork })
	// }
	return getDataSourceAbsoluteUrl(dataSource, dataSource.commentUrl, { notSafeForWork })
}