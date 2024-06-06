import type { DataSource, UserSettings, RateCommentParameters, RateCommentResult } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js'

export default async function rateComment({
	dataSource,
	userSettings,
	...rest
}: {
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<RateCommentParameters, 'proxyUrl'>): Promise<RateCommentResult> {
	return await dataSource.api.rateComment({
		...rest,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})
}
