import configuration from './configuration.js'
import PROVIDERS from './providers.js'

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
	if (typeof configuration.provider === 'object') {
		if (configuration.provider.id === id) {
			return configuration.provider
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
		if (configuration[property] !== undefined) {
			provider[property] = configuration[property]
		}
	}
}

export function getDefaultProviderId() {
	if (typeof configuration.provider === 'string') {
		return configuration.provider
	} else if (typeof configuration.provider === 'object') {
		return configuration.provider.id
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

// Some providers may be deployed on regular HTTP for simplicity.
// `4chan.org` has "https://www.4chan.org" website URL:
// when navigating to "https://4chan.org" images won't load.
// const HTTPS_REGEXP = /^https?:\/\/(www\.)?/
const WWW_REGEXP = /^(www\.)?/
export function isDeployedOnProviderDomain(provider = getProvider()) {
	if (!provider) {
		return false
	}
	if (typeof window !== 'undefined') {
		const domain = window.location.hostname.replace(WWW_REGEXP, '')
		// Replace the `www.` part just in case.
		if (provider.domain.replace(WWW_REGEXP, '') === domain) {
			return true
		}
		if (provider.domains) {
			if (provider.domains.includes(domain)) {
				return true
			}
		}
	}
	return false
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
	let channelUrl
	const provider = getProvider()
	if (provider.getChannelUrlPattern) {
		return provider.getChannelUrlPattern({ notSafeForWork })
	}
	return getProviderAbsoluteUrl(provider.channelUrl)
}

export function getChannelUrl(channelId, {
	notSafeForWork
}) {
	return getChannelUrlPattern({ notSafeForWork })
		.replace('{channelId}', channelId)
}

export function getThreadUrlPattern({ notSafeForWork }) {
	const provider = getProvider()
	if (provider.getThreadUrlPattern) {
		return provider.getThreadUrlPattern({ notSafeForWork })
	}
	return getProviderAbsoluteUrl(provider.threadUrl)
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
	if (provider.getCommentUrl) {
		return provider.getCommentUrl({ notSafeForWork })
	}
	return getProviderAbsoluteUrl(provider.commentUrl)
}

export function getCommentUrl(channelId, threadId, commentId, {
	notSafeForWork
}) {
	return getProviderAbsoluteUrl(
		getCommentUrlPattern({ notSafeForWork })
			.replace('{channelId}', channelId)
			.replace('{threadId}', threadId)
			.replace('{commentId}', commentId)
	)
}

function getProviderAbsoluteUrl(relativeUrl) {
	'https://' + getProvider().domain + relativeUrl
}