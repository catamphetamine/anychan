import type { DataSource } from '@/types'

import DATA_SOURCES from '../../dataSources.js'

export default function getDataSourceById(id: DataSource['id']): DataSource | undefined {
	return DATA_SOURCES[id]
}