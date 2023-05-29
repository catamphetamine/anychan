// Storing a data source in a global variable only works when:
// * Used in a web browser
// * Used on a server and only a single data source is supported: `configuration.dataSource`.
let dataSourceInfo = {}

export function getDataSourceInfo() {
	return dataSourceInfo
}

export function setDataSourceInfo(dataSourceInfo_) {
	if (typeof window === 'undefined') {
		throw new Error('Storing data source info is not implemented on server side')
	}
	dataSourceInfo = dataSourceInfo_
}