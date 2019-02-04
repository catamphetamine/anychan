export default function getHumanReadableLinkAddress(content) {
	content = decodeURI(content)
	return content
		// Remove `https://www.` in the beginning.
		.replace(/^https?:\/\/(www.)?/, '')
		// Remove `/` in the end.
		.replace(/\/$/, '')
}