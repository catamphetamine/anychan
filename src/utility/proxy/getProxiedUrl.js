import getProxyUrl from './getProxyUrl.js'

export default function getProxiedUrl(url, { proxyUrl }) {
	// `proxyUrl: null` could be passed to bypass proxy (for any reason).
	if (proxyUrl === undefined) {
		return url
	}
	return proxyUrl
		.replace('{url}', url)
		.replace('{urlEncoded}', encodeURIComponent(url))
}
