export default function getDataSourceAbsoluteUrl(dataSource, relativeUrl, { notSafeForWork }) {
	if (dataSource.getAbsoluteUrl) {
		return dataSource.getAbsoluteUrl(relativeUrl, { notSafeForWork })
	}
	return 'https://' + dataSource.domain + relativeUrl
}