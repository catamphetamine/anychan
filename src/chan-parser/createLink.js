import parseServiceLink from './parseServiceLink'
import getHumanReadableLinkAddress from './getHumanReadableLinkAddress'

/**
 * Creates post link from `url` and `content`
 * @param  {string} url
 * @param  {string} [content]
 * @return {object}
 */
export default function createLink(url, content) {
	if (content) {
		if (content !== url) {
			return {
				type: 'link',
				url,
				content
			}
		}
	}
	const parsedServiceLink = parseServiceLink(url)
	if (parsedServiceLink) {
		return {
			type: 'link',
			url,
			service: parsedServiceLink.service,
			content: parsedServiceLink.text
		}
	}
	return {
		type: 'link',
		url,
		content: getHumanReadableLinkAddress(url)
	}
}