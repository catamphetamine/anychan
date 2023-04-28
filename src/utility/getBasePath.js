import getConfiguration from '../configuration.js'

import {
	shouldIncludeDataSourceInPath,
	getDataSource,
	getDataSourceAlias,
	addDataSourceIdToPath
} from '../dataSource.js'

/**
 * Returns "base" path of the application.
 * For example, on `catamphetamine.github.io/anychan`
 * the "base" path was "/anychan".
 * @return {string}
 */
export default function getBasePath({ dataSourceId } = {}) {
	if (shouldIncludeDataSourceInPath()) {
		dataSourceId = dataSourceId || getDataSourceAlias() || getDataSource().id
		if (dataSourceId) {
			return addBasePath(addDataSourceIdToPath('', dataSourceId))
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
	if (getConfiguration().path) {
		return getConfiguration().path
	}
}