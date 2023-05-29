import getDataSourceById from './getDataSourceById.js'

export default function getDataSourceIdFromPath(path) {
	const match = path.match(/^\/([^\/]+)/)
	if (match) {
		const possibleDataSourceId = match[1]
		const dataSource = getDataSourceById(possibleDataSourceId)
		if (dataSource) {
			return {
				id: dataSource.id,
				alias: possibleDataSourceId === dataSource.id ? undefined : possibleDataSourceId
			}
		}
	}
}