import getDataSource from '../../utility/dataSource/getDataSource.js'
import isMultiDataSource from '../../utility/dataSource/isMultiDataSource.js'

export const BASE_PREFIX = '⌨️'

export default function getStoragePrefix() {
	return BASE_PREFIX + (isMultiDataSource() ? getDataSource().shortId : '')
}