import type { UserSettings } from '@/types'

import getConfiguration from '../../getConfiguration.js'

export default function getProxyUrl({ userSettings }: { userSettings: UserSettings }): string | undefined {
	// AWS proxy is disabled for now, because "free tier" expires on AWS accounts,
	// which would mean creating new dummy AWS accounts periodically,
	// and most popular imageboards block incoming connections from AWS.
	// if (dataSource.proxy.aws) {
	// 	if (getConfiguration().proxyUrlAws) {
	// 		return getConfiguration().proxyUrlAws
	// 	}
	// }
	if (userSettings) {
		const proxyUrl = userSettings.get('proxyUrl')
		// `proxyUrl: null` could mean "don't use any proxy".
		if (proxyUrl || proxyUrl === null) {
			return proxyUrl
		}
	}
	return getDefaultProxyUrl()
}

export function getDefaultProxyUrl(): string | undefined {
	// `proxyUrl: null` could mean "don't use any proxy".
	if (getConfiguration().proxyUrl || getConfiguration().proxyUrl === null) {
		return getConfiguration().proxyUrl
	}
}