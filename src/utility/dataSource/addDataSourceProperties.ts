import type { DataSource } from '@/types'

type DataSourceAlike = Partial<Pick<DataSource, 'getAbsoluteUrl' | 'domain'>>

export default function addDataSourceProperties(dataSources: DataSourceAlike[]) {
	// import SomeNonImageboardDATASourceLikeReddit from './some-none-imageboard-data-source-like-reddit'

	// For each non-imageboard data source, add utility functions.
	for (const dataSource of dataSources) {
		// Could add any properties to `dataSource` objects here.

		dataSource.getAbsoluteUrl = (relativeUrl, { channelContainsExplicitContent }) => {
			return `https://${dataSource.domain}${relativeUrl}`
		}
	}
}