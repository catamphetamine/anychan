import type { DataSource } from '@/types'

// import isObject from '../isObject.js'
import getConfiguration from '../../getConfiguration.js'

export default function getDefaultDataSourceId(): DataSource['id'] | undefined {
	const { dataSource } = getConfiguration()
	return dataSource
	// if (typeof dataSource === 'string') {
	// 	return dataSource
	// } else if (isObject(dataSource)) {
	// 	return dataSource.id
	// }
}