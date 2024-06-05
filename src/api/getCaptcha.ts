import type { DataSource, UserSettings, GetCaptchaParameters, GetCaptchaResult } from '../types/index.js'

import getProxyUrl from './utility/getProxyUrl.js'

export default async function getCaptcha({
	dataSource,
	userSettings,
	...rest
}: {
	dataSource: DataSource,
	userSettings: UserSettings
} & Omit<GetCaptchaParameters, 'proxyUrl'>): Promise<GetCaptchaResult> {
	return await dataSource.api.getCaptcha({
		...rest,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})
}
