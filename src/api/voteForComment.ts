import type { DataSource, UserSettings, VoteForCommentParameters } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js'

export default async function voteForComment({
	dataSource,
	userSettings,
	...rest
}: {
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<VoteForCommentParameters, 'proxyUrl'>) {
	return await dataSource.api.voteForComment({
		...rest,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})
}
