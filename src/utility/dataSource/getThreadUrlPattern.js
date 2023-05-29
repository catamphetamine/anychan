import getDataSourceAbsoluteUrl from './getDataSourceAbsoluteUrl.js'

export default function getThreadUrlPattern(dataSource, { notSafeForWork }) {
	// if (dataSource.getThreadUrlPattern) {
	// 	return dataSource.getThreadUrlPattern({ notSafeForWork })
	// }
	return getDataSourceAbsoluteUrl(dataSource, dataSource.threadUrl, { notSafeForWork })
}
