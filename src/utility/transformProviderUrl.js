import {
	getProvider,
	getChannelUrlPattern,
	getChannelUrl
} from '../provider.js'

import parseLocationUrl from './parseLocationUrl.js'

// Replaces links to the provider's website with in-app links.
// Example: "https://2ch.hk/a/" → "/a".
export default function transformProviderUrl(url) {
	const location = parseLocationUrl(url)

	let { pathname } = location
	pathname = normalizePathname(pathname)

	const localUrl = getLocalUrl({
		channelUrlPattern: getProvider().channelUrl,
		pathname
	})

	if (localUrl) {
		return localUrl
	}

	return url
}

function getLocalUrl({ channelUrlPattern, pathname }) {
	const channelUrlRegExp = new RegExp(
		escapeRegExpPattern(channelUrlPattern)
			.replace('\\{channelId\\}', '([^\\/]+)')
	)
	const match = pathname.match(channelUrlRegExp)
	if (match) {
		const channelId = match[1]
		return channelUrlPattern.replace('{channelId}', channelId)
	}
}

const REG_EXP_SPECIAL_CHARACTERS_REG_EXP = new RegExp('[.*+?|()\\[\\]{}\\\\]', 'g')

function escapeRegExpPattern(string) {
	return string.replace(REG_EXP_SPECIAL_CHARACTERS_REG_EXP, '\\$&')
}

// Removes a trailing slash from a pathname.
// "/" → "/"
// "/a/" → "/a"
function normalizePathname(pathname) {
	if (pathname.length > 1 && pathname[pathname.length - 1] === '/') {
		return pathname.slice(0, pathname.length - 1)
	}
	return pathname
}