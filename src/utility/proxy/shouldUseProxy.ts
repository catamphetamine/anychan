import type { DataSource } from '@/types'

import isDeployedOnDataSourceDomain from '../dataSource/isDeployedOnDataSourceDomain.js'

export default function shouldUseProxy({ dataSource }: { dataSource: DataSource }): boolean {
	return !isDeployedOnDataSourceDomain(dataSource)
}
