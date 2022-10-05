import configuration from '../configuration.js'

import {
	shouldIncludeProviderInPath,
	getProviderId,
	getProviderAlias,
	addProviderIdToPath
} from '../provider.js'

/**
 * Returns "base" path of the application.
 * For example, on `catamphetamine.github.io/anychan`
 * the "base" path was "/anychan".
 * @return {string}
 */
export default function getBasePath({ providerId } = {}) {
	if (shouldIncludeProviderInPath()) {
		providerId = providerId || getProviderAlias() || getProviderId()
		if (providerId) {
			return addBasePath(addProviderIdToPath('', providerId))
		}
	}
	return _getBasePath() || ''
}

export function addBasePath(path) {
	const basePath = _getBasePath()
	if (basePath) {
		return basePath + path
	}
	return path
}

export function removeBasePath(path) {
	const basePath = _getBasePath()
	if (basePath) {
		if (path.indexOf(basePath) === 0) {
			return path.slice(basePath.length)
		}
	}
	return path
}

function _getBasePath() {
	if (configuration.path) {
		return configuration.path
	}
}