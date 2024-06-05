import type { DataSource, UserSettings, CreateThreadParameters, CreateThreadResult } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js'

export default async function createThread({
	dataSource,
	userSettings,
	...rest
}: {
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<CreateThreadParameters, 'proxyUrl'>): Promise<CreateThreadResult> {
	return await dataSource.api.createThread({
		...rest,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})
}
