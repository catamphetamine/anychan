import configuration from './configuration'
import PROVIDERS from './providers'

export function getProviderById(id) {
	return PROVIDERS[id]
}

export function getProvider(id) {
	if (!id) {
		return window._provider
	}
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

export function getProviderId() {
	if (typeof window === 'undefined') {
		throw new Error('Server-side code not written')
	}
	return window._providerId
}

export function setProviderById(providerId, { alias }) {
	if (typeof window === 'undefined') {
		throw new Error('Server-side code not written')
	}
	window._providerId = providerId
	window._providerAlias = alias
	const provider = window._provider = getProvider(providerId)
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

export function getProviderAlias() {
	return window._providerAlias
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

export function getThreadUrl(channelId, threadId, {
	isNotSafeForWork
}) {
	const provider = getProvider()
	if (provider.getThreadUrl) {
		return provider.getThreadUrl({
			channelId,
			threadId,
			isNotSafeForWork
		})
	}
	return provider.threadUrl
		.replace('{channelId}', channelId)
		.replace('{threadId}', threadId)
}

export function getCommentUrl(channelId, threadId, commentId, {
	isNotSafeForWork
}) {
	const provider = getProvider()
	if (provider.getCommentUrl) {
		return provider.getCommentUrl({
			channelId,
			threadId,
			commentId,
			isNotSafeForWork
		})
	}
	return provider.commentUrl
		.replace('{channelId}', channelId)
		.replace('{threadId}', threadId)
		.replace('{commentId}', commentId)
}