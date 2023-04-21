import getConfiguration from './configuration.js'
import PROVIDERS from './providers.js'

import isDeployedOnProviderDomain_ from './utility/source/isDeployedOnProviderDomain.js'

// Might not work correctly on server side
// in case of multiple supported providers.
let _provider = {}

export function getProviderById(id) {
	return PROVIDERS[id]
}

function getCurrentProviderById(id) {
	const provider = getProviderById(id)
	if (provider) {
		return provider
	}
	if (typeof getConfiguration().provider === 'object') {
		if (getConfiguration().provider.id === id) {
			return getConfiguration().provider
		}
	}
	throw new Error(`Unknown provider: ${id}`)
}

export function getProvider() {
	return _provider.provider
}

export function getProviderId() {
	return _provider.id
}

export function getProviderShortId() {
	return _provider.shortId
}

export function getProviderAlias() {
	return _provider.alias
}

export function isMultiProvider() {
	return _provider.multiProvider
}

export function setProviderById(id, { alias, multiProvider }) {
	const provider = getCurrentProviderById(id)
	_provider = {
		provider,
		id,
		shortId: provider.shortId,
		multiProvider,
		alias
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
			provider[property] = getConfiguration()[property]
		}
	}
}

export function getDefaultProviderId() {
	if (typeof getConfiguration().provider === 'string') {
		return getConfiguration().provider
	} else if (typeof getConfiguration().provider === 'object') {
		return getConfiguration().provider.id
	}
}

export function shouldIncludeProviderInPath() {
	return getDefaultProviderId() ? false : true
}

export function getProviderIdFromPath(path) {
	const match = path.match(/^\/([^\/]+)/)
	if (match) {
		const possibleProviderId = match[1]
		const provider = getProviderById(possibleProviderId)
		if (provider) {
			return {
				id: provider.id,
				alias: possibleProviderId === provider.id ? undefined : possibleProviderId
			}
		}
	}
}

export function addProviderIdToPath(path, providerId) {
	return `/${providerId}${path}`
}

export function isDeployedOnProviderDomain() {
	return isDeployedOnProviderDomain_(getProvider())
}

export function getProviderIdByDomain() {
	for (const providerId of Object.keys(PROVIDERS)) {
		const provider = PROVIDERS[providerId]
		if (isDeployedOnProviderDomain(provider)) {
			return provider
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
		if (!isDeployedOnProviderDomain() ) {
			return `https://${getProvider().domain}${url}`
		}
	}
	return url
}

export function getChannelUrlPattern({ notSafeForWork }) {
	const provider = getProvider()
	// if (provider.getChannelUrlPattern) {
	// 	return provider.getChannelUrlPattern({ notSafeForWork })
	// }
	return getProviderAbsoluteUrl(provider.channelUrl, { notSafeForWork })
}

export function getChannelUrl(channelId, {
	notSafeForWork
}) {
	return getChannelUrlPattern({ notSafeForWork })
		.replace('{channelId}', channelId)
}

export function getThreadUrlPattern({ notSafeForWork }) {
	const provider = getProvider()
	// if (provider.getThreadUrlPattern) {
	// 	return provider.getThreadUrlPattern({ notSafeForWork })
	// }
	return getProviderAbsoluteUrl(provider.threadUrl, { notSafeForWork })
}

export function getThreadUrl(channelId, threadId, {
	notSafeForWork
}) {
	return getThreadUrlPattern({ notSafeForWork })
		.replace('{channelId}', channelId)
		.replace('{threadId}', threadId)
}

export function getCommentUrlPattern({ notSafeForWork }) {
	const provider = getProvider()
	// if (provider.getCommentUrl) {
	// 	return provider.getCommentUrl({ notSafeForWork })
	// }
	return getProviderAbsoluteUrl(provider.commentUrl, { notSafeForWork })
}

export function getCommentUrl(channelId, threadId, commentId, {
	notSafeForWork
}) {
	return getCommentUrlPattern({ notSafeForWork })
		.replace('{channelId}', channelId)
		.replace('{threadId}', threadId)
		.replace('{commentId}', commentId)
}

function getProviderAbsoluteUrl(relativeUrl, { notSafeForWork }) {
	const provider = getProvider()
	if (provider.getAbsoluteUrl) {
		return provider.getAbsoluteUrl(relativeUrl, { notSafeForWork })
	}
	return 'https://' + getProvider().domain + relativeUrl
}