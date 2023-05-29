import { getDataSourceInfo } from './dataSourceInfoStore.js'

export default function getDataSource() {
	return getDataSourceInfo().dataSource
}