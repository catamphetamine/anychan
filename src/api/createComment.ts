import type { DataSource, UserSettings, CreateCommentParameters } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js'

export default async function createComment({
	dataSource,
	userSettings,
	...rest
}: {
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<CreateCommentParameters, 'proxyUrl'>) {
	return await dataSource.api.createComment({
		...rest,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})
}
