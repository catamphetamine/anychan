import type { DataSource } from '@/types'

import DATA_SOURCES from '../../dataSources.js'
import isDeployedOnDataSourceDomain from './isDeployedOnDataSourceDomain.js'

export default function getDataSourceIdByDomain(): DataSource['id'] | undefined {
	for (const dataSourceId of Object.keys(DATA_SOURCES)) {
		const dataSource = DATA_SOURCES[dataSourceId]
		if (isDeployedOnDataSourceDomain(dataSource)) {
			return dataSourceId
		}
	}
}
