import type { DataSource } from '@/types'

import getBasePath from '../getBasePath.js'

export default function getDataSourceBasePath(dataSource: DataSource) {
	return getBasePath({
		dataSource,
		dataSourceAlias: getDataSourceAliasForBasePath(dataSource)
	})
}

// Use an alias: "alogs" → "alogs.space".
// The reason is that an HTTP request to `http://localhost:1234/alogs.space`
// attempts to search for a file and returns "Not Found".
// To work around that, `http://localhost:1234/alogsspace` URL is used instead
// when developing the application on a local machine.
function getDataSourceAliasForBasePath(dataSource: DataSource) {
	if (!isValidBasePath(dataSource.id)) {
		if (dataSource.aliases) {
			for (const dataSourceAlias of dataSource.aliases) {
				if (isValidBasePath(dataSourceAlias)) {
					return dataSourceAlias
				}
			}
		}
	}
}

function isValidBasePath(basePath: string) {
	return !basePath.includes('.')
}