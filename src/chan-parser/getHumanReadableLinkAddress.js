export default function getHumanReadableLinkAddress(url) {
	try {
		url = decodeURI(url)
	} catch (error) {
		// Sometimes throws "URIError: URI malformed".
		console.error(error)
	}
	// Remove `/` in the end.
	url = url.replace(/\/$/, '')
	// Maybe use special format for popular services.
	const formatted = formatUrlForServices(url)
	if (formatted) {
		return formatted
	}
	return url
		// Remove `https://www.` in the beginning.
		.replace(/^https?:\/\/(www\.)?/, '')
}

export function formatUrlForServices(url) {
	// `URL` is not available in IE11.
	try {
		url = new URL(url)
	} catch (error) {
		// Can throw "Invalid URL".
		console.error(url)
		console.error(error)
		return
	}
	const hostname = url.hostname
		// Remove `www.` in the beginning.
		.replace(/^www\./, '')
	switch (hostname) {
		case 'youtube.com':
			if (url.pathname === '/watch' && url.searchParams.get('v')) {
				return `YouTube/${url.searchParams.get('v')}`
			}
			if (/^\/user\/[^\/]+/.test(url.pathname)) {
				const match = url.pathname.match(/^\/user\/([^\/]+)/)
				if (match) {
					return `YouTube/${match[1]}`
				}
			}
			break
		case 'facebook.com':
			if (url.pathname === '/profile.php' && url.searchParams.get('id')) {
				return `Facebook/${url.searchParams.get('id')}`
			}
			if (/^\/[^\/]+/.test(url.pathname)) {
				return `Facebook${url.pathname}`
			}
			break
		case 'vk.com':
			if (/^\/[^\/]+/.test(url.pathname)) {
				return `VK${url.pathname.replace(/^\/id/, '/')}`
			}
			break
		case 'instagram.com':
			if (/^\/[^\/]+/.test(url.pathname)) {
				return `Instagram${url.pathname}`
			}
			break
		case 'discord.gg':
			if (/^\/[^\/]+/.test(url.pathname)) {
				return `Discord${url.pathname}`
			}
			break
		case 't.me':
			if (url.pathname.indexOf('/joinchat/') === 0) {
				const match = url.pathname.match(/^\/joinchat\/([^\/]+)/)
				if (match) {
					return `Telegram/${match[1]}`
				}
			}
			if (/^\/[^\/]+/.test(url.pathname)) {
				return `Telegram${url.pathname}`
			}
			break
	}
}