import type { DataSource, UserSettings } from '@/types'

import shouldUseProxy from '../../utility/proxy/shouldUseProxy.js'
import getProxyUrl from '../../utility/proxy/getProxyUrl.js'

export default function({ dataSource, userSettings }: { dataSource: DataSource, userSettings: UserSettings }): string | undefined {
	if (shouldUseProxy({ dataSource })) {
		// Returning `null` could mean "don't use any proxy".
		return getProxyUrl({ userSettings })
	}
}