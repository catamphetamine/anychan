import { getDataSourceInfo } from './dataSourceInfoStore.js'

export default function isMultiDataSource() {
	return getDataSourceInfo().dataSource
}