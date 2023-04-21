import getProxyUrl from './getProxyUrl.js'

export default function getProxiedUrl(url, { proxyUrl, userSettings }) {
	if (!proxyUrl) {
		proxyUrl = getProxyUrl({ userSettings })
	}
	return proxyUrl
		.replace('{url}', url)
		.replace('{urlEncoded}', encodeURIComponent(url))
}
