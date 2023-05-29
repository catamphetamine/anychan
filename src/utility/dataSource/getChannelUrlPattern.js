import getDataSourceAbsoluteUrl from './getDataSourceAbsoluteUrl.js'

export default function getChannelUrlPattern(dataSource, { notSafeForWork }) {
	// if (dataSource.getChannelUrlPattern) {
	// 	return dataSource.getChannelUrlPattern({ notSafeForWork })
	// }
	return getDataSourceAbsoluteUrl(dataSource, dataSource.channelUrl, { notSafeForWork })
}