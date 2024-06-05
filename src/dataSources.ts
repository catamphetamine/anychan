import type { DataSource } from '@/types'

// Exports a list of data sources indexed by data source id.
// Also, sets `.icon` and `.logo` for each data source.

import DATA_SOURCES_LIST from '../dataSources/index-with-resources.js'

// Create an index of all supported dataSources.
const DATA_SOURCES: Record<string, DataSource> = DATA_SOURCES_LIST.reduce((
	dataSources: Record<string, DataSource>,
	dataSource
) => {
	dataSources[dataSource.id] = dataSource
	if (dataSource.aliases) {
		for (const alias of dataSource.aliases) {
			dataSources[alias] = dataSource
		}
	}
	return dataSources
}, {})

// Exports an index of all supported dataSources.
export default DATA_SOURCES // Record<string, Omit<DataSource, 'icon' | 'logo'>