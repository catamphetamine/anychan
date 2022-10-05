import { getProviderShortId, isMultiProvider } from '../../provider.js'

export const BASE_PREFIX = '⌨️'

export default function getStoragePrefix() {
	return BASE_PREFIX + (isMultiProvider() ? getProviderShortId() : '')
}