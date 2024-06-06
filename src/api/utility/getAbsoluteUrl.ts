/**
 * Adds HTTP origin to a possibly relative URL.
 */
export default function getAbsoluteUrl(url: string, domain: string) {
	const isRelativeUrl = url[0] === '/' && url[1] !== '/'
	if (isRelativeUrl) {
		return `https://${domain}${url}`
	}
	return url
}