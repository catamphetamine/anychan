import type { DataSource } from '@/types'

export default function addDataSourceIdToPath(path: string, dataSourceId: DataSource['id']) {
	return `/${dataSourceId}${path}`
}