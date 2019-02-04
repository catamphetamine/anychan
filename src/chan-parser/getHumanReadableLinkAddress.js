export default function getHumanReadableLinkAddress(content) {
	try {
		content = decodeURI(content)
	} catch (error) {
		// Sometimes throws "URIError: URI malformed".
		console.error(error)
	}
	return content
		// Remove `https://www.` in the beginning.
		.replace(/^https?:\/\/(www.)?/, '')
		// Remove `/` in the end.
		.replace(/\/$/, '')
}