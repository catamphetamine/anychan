import type { DataSource } from '@/types'

import getConfiguration from '../../getConfiguration.js'
import getDataSourceById from './getDataSourceById.js'

import isObject from '../isObject.js'

export default function getCurrentDataSourceById(id: DataSource['id']): DataSource {
	const dataSource = getCurrentDataSourceById_(id)
	for (const property of DATA_SOURCE_OVERRIDABLE_PARAMETERS) {
		if (getConfiguration()[property] !== undefined) {
			dataSource[property] = getConfiguration()[property]
		}
	}
	return dataSource
}

function getCurrentDataSourceById_(id: DataSource['id']): DataSource {
	const dataSource = getDataSourceById(id)
	if (dataSource) {
		return dataSource
	}
	const { dataSource: dataSourceFromConfiguration } = getConfiguration()
	if (typeof dataSourceFromConfiguration === 'string') {
		// Ignore.
		// TypeScript will assume `dataSourceFromConfiguration` is an object in `else`.
	} else if (isObject(dataSourceFromConfiguration)) {
		if (dataSourceFromConfiguration.id === id) {
			return dataSourceFromConfiguration
		}
	}
	throw new Error(`Unknown dataSource: ${id}`)
}

// Apply customization from configuration.
const DATA_SOURCE_OVERRIDABLE_PARAMETERS = [
	'icon',
	'logo',
	'title',
	'subtitle',
	'description',
	'footnotes'
] as const
