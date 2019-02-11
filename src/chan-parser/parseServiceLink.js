/**
 * Parses popular service links.
 * @param  {string} url
 * @return {object} [result] `{ service: string, text: string }`
 */
export default function parseServiceLink(url) {
	// Remove `/` in the end.
	url = url.replace(/\/$/, '')
	// `URL` is not available in IE11.
	try {
		url = new URL(url)
	} catch (error) {
		// Can throw "Invalid URL".
		console.error(url)
		console.error(error)
		return
	}
	// Remove `www.` in the beginning.
	const hostname = url.hostname.replace(/^www\./, '')
	switch (hostname) {
		case 'youtube.com':
			if (url.pathname === '/watch' && url.searchParams.get('v')) {
				return {
					service: 'youtube',
					text: url.searchParams.get('v')
				}
			}
			if (url.pathname.indexOf('/user/') === 0) {
				const match = url.pathname.match(/^\/user\/([^\/]+)/)
				if (match) {
					return {
						service: 'youtube',
						text: match[1]
					}
				}
			}
			break
		case 'youtu.be':
			if (/^\/[^\/]+/.test(url.pathname)) {
				return {
					service: 'youtube',
					text: url.pathname.slice('/'.length)
				}
			}
			break
		case 'vimeo.com':
			if (/^\/[^\/]+/.test(url.pathname)) {
				return {
					service: 'vimeo',
					text: url.pathname.slice('/'.length)
				}
			}
		case 'player.vimeo.com':
			if (url.pathname.indexOf('/video/') === 0) {
				const match = url.pathname.match(/^\/video\/([^\/]+)/)
				if (match) {
					return {
						service: 'vimeo',
						text: match[1]
					}
				}
			}
			break
		case 'facebook.com':
			if (url.pathname === '/profile.php' && url.searchParams.get('id')) {
				return {
					service: 'facebook',
					text: url.searchParams.get('id')
				}
			}
			if (/^\/[^\/]+/.test(url.pathname)) {
				return {
					service: 'facebook',
					text: url.pathname.slice('/'.length)
				}
			}
			break
		case 'vk.com':
			if (/^\/[^\/]+/.test(url.pathname)) {
				return {
					service: 'vk',
					text: url.pathname.slice('/'.length).replace(/^id/, '')
				}
			}
			break
		case 'instagram.com':
			if (/^\/[^\/]+/.test(url.pathname)) {
				return {
					service: 'instagram',
					text: url.pathname.slice('/'.length)
				}
			}
			break
		case 'discord.gg':
			if (/^\/[^\/]+/.test(url.pathname)) {
				return {
					service: 'discord',
					text: url.pathname.slice('/'.length)
				}
			}
			break
		case 'twitter.com':
			if (/^\/[^\/]+/.test(url.pathname)) {
				return {
					service: 'twitter',
					text: url.pathname.slice('/'.length)
				}
			}
			break
		case 't.me':
			if (url.pathname.indexOf('/joinchat/') === 0) {
				const match = url.pathname.match(/^\/joinchat\/([^\/]+)/)
				if (match) {
					return {
						service: 'telegram',
						text: match[1]
					}
				}
			}
			if (/^\/[^\/]+/.test(url.pathname)) {
				return {
					service: 'telegram',
					text: url.pathname.slice('/'.length)
				}
			}
			break
		case 'archivach.org':
		case 'arhivach.cf':
			if (url.pathname.indexOf('/thread/') === 0) {
				const match = url.pathname.match(/^\/thread\/([^\/]+)/)
				if (match) {
					return {
						service: 'arhivach',
						text: match[1]
					}
				}
			}
	}
}