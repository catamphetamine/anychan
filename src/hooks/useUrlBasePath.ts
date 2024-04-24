import useDataSource from './useDataSource.js'
import useDataSourceAlias from './useDataSourceAlias.js'

import getBasePath from '../utility/getBasePath.js'

export default function useUrlBasePath(): string {
	const dataSource = useDataSource()
	const dataSourceAlias = useDataSourceAlias()

	return getBasePath({ dataSource, dataSourceAlias })
}