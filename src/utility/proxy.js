import configuration from '../configuration.js'
import getUserSettings from '../UserSettings.js'
import { isDeployedOnProviderDomain } from '../provider.js'

export function shouldUseProxy() {
	return !isDeployedOnProviderDomain()
}

export function getProxyUrl({ userSettings = getUserSettings() } = {}) {
	// AWS proxy is disabled for now, because "free tier" expires on AWS accounts,
	// which would mean creating new dummy AWS accounts periodically,
	// and most popular imageboards block incoming connections from AWS.
	// if (getProvider().proxy.aws) {
	// 	if (configuration.proxyUrlAws) {
	// 		return configuration.proxyUrlAws
	// 	}
	// }
	const proxyUrl = userSettings.get('proxyUrl')
	if (proxyUrl) {
		return proxyUrl
	}
	if (configuration.proxyUrl) {
		return configuration.proxyUrl
	}
}

export function proxyUrl(url) {
	return getProxyUrl().replace('{url}', url)
}
