import type { DataSource, UserSettings, LogOutParameters } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js'

export default async function logOut({
	dataSource,
	userSettings,
	...rest
}: {
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<LogOutParameters, 'proxyUrl'>) {
	return await dataSource.api.logOut({
		...rest,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})
}
