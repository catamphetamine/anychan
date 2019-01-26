import test from './getHumanReadableLinkAddress.test'

export default function getHumanReadableLinkAddress(content) {
	return content
		// Remove `https://www.` in the beginning.
		.replace(/^https?:\/\/(www.)?/, '')
		// Remove `/` in the end.
		.replace(/\/$/, '')
}

test(getHumanReadableLinkAddress)