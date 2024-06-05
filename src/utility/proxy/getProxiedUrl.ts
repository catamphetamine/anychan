export default function getProxiedUrl(
	url: string,
	{ proxyUrl }: { proxyUrl: string }
): string {
	// `proxyUrl: null` could be passed to bypass proxy (for any reason).
	if (proxyUrl === undefined) {
		return url
	}

	return proxyUrl
		.replace('{url}', url)
		.replace('{urlEncoded}', encodeURIComponent(url))
}
