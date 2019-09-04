import { getChan, getProxyUrl } from '../chan'

export default function proxyUrl(url) {
	if (!getChan().proxy) {
		return url
	}
	const proxyUrl = getProxyUrl()
	if (proxyUrl) {
		return proxyUrl.replace('{url}', url)
	}
	return url
}
