import configuration from '../configuration'
import UserSettings from './UserSettings'
import { isDeployedOnChanDomain } from '../chan'

export function shouldUseProxy() {
	return !isDeployedOnChanDomain()
}

export function getProxyUrl() {
	// AWS proxy is disabled for now, because "free tier" expires on AWS accounts,
	// which would mean creating new dummy AWS accounts periodically,
	// and most popular chans block incoming connections from AWS.
	// if (getChan().proxy.aws) {
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
