import getConfiguration from '../../configuration.js'

export default function getProxyUrl({ userSettings }) {
	// AWS proxy is disabled for now, because "free tier" expires on AWS accounts,
	// which would mean creating new dummy AWS accounts periodically,
	// and most popular imageboards block incoming connections from AWS.
	// if (getProvider().proxy.aws) {
	// 	if (getConfiguration().proxyUrlAws) {
	// 		return getConfiguration().proxyUrlAws
	// 	}
	// }
	const proxyUrl = userSettings.get('proxyUrl')
	if (proxyUrl) {
		return proxyUrl
	}
	if (getConfiguration().proxyUrl) {
		return getConfiguration().proxyUrl
	}
}