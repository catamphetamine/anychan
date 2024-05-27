import type { DataSource } from '@/types'

// Exports a list of data sources indexed by data source id.
// Also, sets `.icon` and `.logo` for each data source.

import DATA_SOURCES_LIST from '../dataSources/index.js'

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

// Add alias: "8kun" → "8ch".
// The reason is that I consider "8ch" a better name.
DATA_SOURCES['8ch'].aliases = ['8kun']

// Add alias: "alogs" → "alogs.space".
// The reason is that an HTTP request to `http://localhost:1234/alogs.space`
// attempts to search for a file and returns "Not Found".
// To work around that, `http://localhost:1234/alogsspace` URL is used instead
// when developing the application on a local machine.
DATA_SOURCES['alogs.space'].aliases = ['alogsspace']

// Exports an index of all supported dataSources.
export default DATA_SOURCES // Record<string, Omit<DataSource, 'icon' | 'logo'>