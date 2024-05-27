import type { DataSource, UserSettings, LogInParameters } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js'

export default async function logIn({
	dataSource,
	userSettings,
	...rest
}: {
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<LogInParameters, 'proxyUrl'>) {
	return await dataSource.api.logIn({
		...rest,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})
}
