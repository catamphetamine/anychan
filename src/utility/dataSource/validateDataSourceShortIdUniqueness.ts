import type { DataSource } from '@/types'

type DataSourceAlike = Pick<DataSource, 'id' | 'shortId'>

// Validate `shortId` uniqueness across different `dataSource`s.
export default function validateDataSourceShortIdUniqueness(dataSources: DataSourceAlike[]) {
	const shortIdToDataSource: Record<DataSource['shortId'], DataSourceAlike> = {}
	for (const dataSource of dataSources) {
		if (shortIdToDataSource[dataSource.shortId]) {
			throw new Error(`Data source "${dataSource.id}" has a \`shortId\` of "${dataSource.shortId}" which is already in use by data source "${shortIdToDataSource[dataSource.shortId].id}"`);
		}
		shortIdToDataSource[dataSource.shortId] = dataSource
	}
}
