import { getDataSource, isMultiDataSource } from '../../dataSource.js'

export const BASE_PREFIX = '⌨️'

export default function getStoragePrefix() {
	return BASE_PREFIX + (isMultiDataSource() ? getDataSource().shortId : '')
}