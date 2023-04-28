// Exports a list of data sources indexed by data source id.
// Also, sets `.icon` and `.logo` for each data source.

import DATA_SOURCES_LIST from '../dataSources/index.js'

// Create an index of all supported dataSources.
const DATA_SOURCES = DATA_SOURCES_LIST.reduce((index, dataSource) => {
	index[dataSource.id] = dataSource
	if (dataSource.aliases) {
		for (const alias of dataSource.aliases) {
			index[alias] = dataSource
		}
	}
	return index
}, {})

// Add "8kun" alias to "8ch".
DATA_SOURCES['8ch'].aliases = ['8kun']

// Exports an index of all supported dataSources.
export default DATA_SOURCES