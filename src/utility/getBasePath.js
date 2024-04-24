import getConfiguration from '../getConfiguration.ts'

import addDataSourceIdToPath from './dataSource/addDataSourceIdToPath.js'
import shouldIncludeDataSourceInPath from './dataSource/shouldIncludeDataSourceInPath.js'

/**
 * Returns "base" path of the application based on a "data source" ID.
 * @param {object}
 * @return {string}
 */
export default function getBasePath({
	dataSource,
	dataSourceAlias
}) {
	if (shouldIncludeDataSourceInPath()) {
		return addBasePath(addDataSourceIdToPath('', dataSourceAlias || dataSource.id))
	}
	return getCoreBasePath() || ''
}

export function addBasePath(path) {
	const basePath = getCoreBasePath()
	if (basePath) {
		return basePath + path
	}
	return path
}

export function removeBasePath(path) {
	const basePath = getCoreBasePath()
	if (basePath) {
		if (path.indexOf(basePath) === 0) {
			return path.slice(basePath.length)
		}
	}
	return path
}

/**
 * Returns "base" path of the application.
 * For example, on `catamphetamine.github.io/anychan`, the "base" path was "/anychan",
 * and on `anychans.github.io` it's `""`.
 * @return {string}
 */
function getCoreBasePath() {
	if (getConfiguration().path) {
		return getConfiguration().path
	}
}