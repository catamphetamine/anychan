import configuration from '../configuration'
import UserSettings from './UserSettings'
import { isDeployedOnProviderDomain } from '../provider'

export function shouldUseProxy() {
	return !isDeployedOnProviderDomain()
}

export function getProxyUrl() {
	// AWS proxy is disabled for now, because "free tier" expires on AWS accounts,
	// which would mean creating new dummy AWS accounts periodically,
	// and most popular imageboards block incoming connections from AWS.
	// if (getProvider().proxy.aws) {
	// 	if (configuration.proxyUrlAws) {
	// 		return configuration.proxyUrlAws
	// 	}
	// }
	const proxyUrl = UserSettings.get('proxyUrl')
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
