import type { DataSource } from '@/types'

export const BASE_PREFIX = '⌨️'

export default function getStoragePrefix({
	dataSource,
	multiDataSource
}: {
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	return BASE_PREFIX + (multiDataSource ? dataSource.shortId : '')
}