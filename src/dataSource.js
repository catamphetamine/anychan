import getConfiguration from './configuration.js'
import DATA_SOURCES from './dataSources.js'

import isDeployedOnDataSourceDomain_ from './utility/source/isDeployedOnDataSourceDomain.js'

// Might not work correctly on server side
// in case of multiple supported dataSources.
let _dataSource = {}

export function getDataSourceById(id) {
	return DATA_SOURCES[id]
}

function getCurrentDataSourceById(id) {
	const dataSource = getDataSourceById(id)
	if (dataSource) {
		return dataSource
	}
	if (typeof getConfiguration().dataSource === 'object') {
		if (getConfiguration().dataSource.id === id) {
			return getConfiguration().dataSource
		}
	}
	throw new Error(`Unknown dataSource: ${id}`)
}

export function getDataSource() {
	return _dataSource.dataSource
}

export function getDataSourceAlias() {
	return _dataSource.dataSourceAlias
}

export function isMultiDataSource() {
	return _dataSource.multiDataSource
}

export function setDataSourceById(id, { alias: dataSourceAlias, multiDataSource }) {
	const dataSource = getCurrentDataSourceById(id)
	_dataSource = {
		dataSource,
		dataSourceAlias,
		multiDataSource
	}
	// Apply customization from configuration.
	const CUSTOMIZABLE_PROPERTIES = [
		'icon',
		'logo',
		'title',
		'subtitle',
		'description',
		'footnotes'
	]
	for (const property of CUSTOMIZABLE_PROPERTIES) {
		if (getConfiguration()[property] !== undefined) {
			dataSource[property] = getConfiguration()[property]
		}
	}
	return {
		dataSource,
		dataSourceAlias,
		multiDataSource
	}
}

export function getDefaultDataSourceId() {
	if (typeof getConfiguration().dataSource === 'string') {
		return getConfiguration().dataSource
	} else if (typeof getConfiguration().dataSource === 'object') {
		return getConfiguration().dataSource.id
	}
}

export function shouldIncludeDataSourceInPath() {
	return getDefaultDataSourceId() ? false : true
}

export function getDataSourceIdFromPath(path) {
	const match = path.match(/^\/([^\/]+)/)
	if (match) {
		const possibleDataSourceId = match[1]
		const dataSource = getDataSourceById(possibleDataSourceId)
		if (dataSource) {
			return {
				id: dataSource.id,
				alias: possibleDataSourceId === dataSource.id ? undefined : possibleDataSourceId
			}
		}
	}
}

export function addDataSourceIdToPath(path, dataSourceId) {
	return `/${dataSourceId}${path}`
}

export function isDeployedOnDataSourceDomain() {
	return isDeployedOnDataSourceDomain_(getDataSource())
}

export function getDataSourceIdByDomain() {
	for (const dataSourceId of Object.keys(DATA_SOURCES)) {
		const dataSource = DATA_SOURCES[dataSourceId]
		if (isDeployedOnDataSourceDomain(dataSource)) {
			return dataSource
		}
	}
}

/**
 * Adds HTTP origin to a possibly relative URL.
 * For example, if this application is deployed on 2ch.hk domain
 * then there's no need to query `https://2ch.hk/...` URLs
 * and instead relative URLs `/...` should be queried.
 * This function checks whether the application should use
 * relative URLs and transforms the URL accordingly.
 */
export function getAbsoluteUrl(url) {
	if (url[0] === '/' && url[1] !== '/') {
		if (!isDeployedOnDataSourceDomain() ) {
			return `https://${getDataSource().domain}${url}`
		}
	}
	return url
}

export function getChannelUrlPattern({ notSafeForWork }) {
	const dataSource = getDataSource()
	// if (dataSource.getChannelUrlPattern) {
	// 	return dataSource.getChannelUrlPattern({ notSafeForWork })
	// }
	return getDataSourceAbsoluteUrl(dataSource.channelUrl, { notSafeForWork })
}

export function getChannelUrl(channelId, {
	notSafeForWork
}) {
	return getChannelUrlPattern({ notSafeForWork })
		.replace('{channelId}', channelId)
}

export function getThreadUrlPattern({ notSafeForWork }) {
	const dataSource = getDataSource()
	// if (dataSource.getThreadUrlPattern) {
	// 	return dataSource.getThreadUrlPattern({ notSafeForWork })
	// }
	return getDataSourceAbsoluteUrl(dataSource.threadUrl, { notSafeForWork })
}

export function getThreadUrl(channelId, threadId, {
	notSafeForWork
}) {
	return getThreadUrlPattern({ notSafeForWork })
		.replace('{channelId}', channelId)
		.replace('{threadId}', threadId)
}

export function getCommentUrlPattern({ notSafeForWork }) {
	const dataSource = getDataSource()
	// if (dataSource.getCommentUrl) {
	// 	return dataSource.getCommentUrl({ notSafeForWork })
	// }
	return getDataSourceAbsoluteUrl(dataSource.commentUrl, { notSafeForWork })
}

export function getCommentUrl(channelId, threadId, commentId, {
	notSafeForWork
}) {
	return getCommentUrlPattern({ notSafeForWork })
		.replace('{channelId}', channelId)
		.replace('{threadId}', threadId)
		.replace('{commentId}', commentId)
}

function getDataSourceAbsoluteUrl(relativeUrl, { notSafeForWork }) {
	const dataSource = getDataSource()
	if (dataSource.getAbsoluteUrl) {
		return dataSource.getAbsoluteUrl(relativeUrl, { notSafeForWork })
	}
	return 'https://' + getDataSource().domain + relativeUrl
}