import type { DataSource } from '@/types'

import { actualDomainMatchesDomain } from '../matchesDomain.js'

export default function isDeployedOnDataSourceDomain(dataSource: DataSource): boolean {
	if (!dataSource) {
		return false
	}
	return actualDomainMatchesDomain({
		domain: dataSource.domain,
		domains: dataSource.domains
	})
}