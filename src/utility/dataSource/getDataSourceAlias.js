import { getDataSourceInfo } from './dataSourceInfoStore.js'

export default function getDataSourceAlias() {
	return getDataSourceInfo().dataSourceAlias
}