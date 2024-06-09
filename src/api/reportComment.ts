import type { DataSource, UserSettings, ReportCommentParameters, ReportCommentResult } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js'

export default async function reportComment({
	dataSource,
	userSettings,
	...rest
}: {
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<ReportCommentParameters, 'proxyUrl'>): Promise<ReportCommentResult> {
	return await dataSource.api.reportComment({
		...rest,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})
}