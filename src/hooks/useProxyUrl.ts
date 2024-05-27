import useProxyRequired from './useProxyRequired.js'
import useSettings from './useSettings.js'

import getProxyUrl from '../utility/proxy/getProxyUrl.js'

export default function useProxyUrl() {
	const isProxyRequired = useProxyRequired()
	const userSettings = useSettings()

	if (isProxyRequired) {
		// Returning `null` could mean "don't use any proxy".
		return getProxyUrl({ userSettings })
	}
}