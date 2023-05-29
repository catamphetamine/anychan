export default function addDataSourceIdToPath(path, dataSourceId) {
	return `/${dataSourceId}${path}`
}