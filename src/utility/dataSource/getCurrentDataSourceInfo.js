import getConfiguration from '../../getConfiguration.ts'
import getDataSourceById from './getDataSourceById.js'

export default function getCurrentDataSourceInfo({
	id,
	alias: dataSourceAlias,
	multiDataSource
}) {
	const dataSource = getCurrentDataSourceById(id)
	for (const property of CUSTOMIZABLE_PROPERTIES) {
		if (getConfiguration()[property] !== undefined) {
			dataSource[property] = getConfiguration()[property]
		}
	}
	return {
		dataSource,
		dataSourceAlias,
		multiDataSource
	}
}

function getCurrentDataSourceById(id) {
	const dataSource = getDataSourceById(id)
	if (dataSource) {
		return dataSource
	}
	if (typeof getConfiguration().dataSource === 'object') {
		if (getConfiguration().dataSource.id === id) {
			return getConfiguration().dataSource
		}
	}
	throw new Error(`Unknown dataSource: ${id}`)
}

// Apply customization from configuration.
const CUSTOMIZABLE_PROPERTIES = [
	'icon',
	'logo',
	'title',
	'subtitle',
	'description',
	'footnotes'
]
