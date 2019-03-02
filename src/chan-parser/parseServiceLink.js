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
	const service = SERVICES[hostname]
	if (service) {
		return {
			service: service.name,
			text: (service.getText && service.getText(url)) ||
				url.pathname.slice('/'.length) ||
				(url.search + url.hash) ||
				hostname
		}
	}
}

const SERVICES = {
	'vimeo.com': {
		name: 'vimeo'
	},
	'player.vimeo.com': {
		name: 'vimeo',
		getText(url) {
			if (url.pathname.indexOf('/video/') === 0) {
				const match = url.pathname.match(/^\/video\/([^\/]+)/)
				if (match) {
					return match[1]
				}
			}
		}
	},
	'youtube.com': {
		name: 'youtube',
		getText(url) {
			if (url.pathname === '/watch' && url.searchParams.get('v')) {
				return url.searchParams.get('v')
			}
			if (url.pathname.indexOf('/user/') === 0) {
				const match = url.pathname.match(/^\/user\/(.+)/)
				if (match) {
					return match[1].replace(/\/videos$/, '')
				}
			}
			if (url.pathname.indexOf('/channel/') === 0) {
				const match = url.pathname.match(/^\/channel\/(.+)/)
				if (match) {
					return match[1].replace(/\/videos$/, '')
				}
			}
			if (url.pathname === '/playlist' && url.searchParams.get('list')) {
				return `playlist/${url.searchParams.get('list')}`
			}
		}
	},
	'youtu.be': {
		name: 'youtube'
	},
	'github.com': {
		name: 'github'
	},
	'twitter.com': {
		name: 'twitter',
		getText(url) {
			const postMatch = url.pathname.match(/^\/(.+?)\/status\/(.+)$/)
			if (postMatch) {
				return `${postMatch[1]}/${postMatch[2]}`
			}
		}
	},
	'instagram.com': {
		name: 'instagram'
	},
	'discord.gg': {
		name: 'discord'
	},
	'vk.com': {
		name: 'vk',
		getText(url) {
			if (/^\/[^\/]+/.test(url.pathname)) {
				return url.pathname.slice('/'.length).replace(/^id/, '')
			}
		}
	},
	'facebook.com': {
		name: 'facebook',
		getText(url) {
			if (url.pathname === '/profile.php' && url.searchParams.get('id')) {
				return url.searchParams.get('id')
			}
			const peopleMatch = url.pathname.match(/^\/people\/(.+?)\//)
			if (peopleMatch) {
				return peopleMatch[1]
			}
		}
	},
	't.me': {
		name: 'telegram',
		getText(url) {
			if (url.pathname.indexOf('/joinchat/') === 0) {
				const match = url.pathname.match(/^\/joinchat\/([^\/]+)/)
				if (match) {
					return match[1]
				}
			}
		}
	},
	'teleg.run': {
		name: 'telegram'
	},
	'archivach.org': {
		name: 'arhivach',
		getText(url) {
			if (url.pathname.indexOf('/thread/') === 0) {
				const match = url.pathname.match(/^\/thread\/([^\/]+)/)
				if (match) {
					return match[1]
				}
			}
			if (url.searchParams.get('tags')) {
				return url.searchParams.get('tags')
			}
		}
	},
	'2ch.hk': {
		name: '2ch',
		getText(url) {
			const matchBoard = url.pathname.match(/^\/([^\/]+)$/)
			if (matchBoard) {
				return `/${matchBoard[1]}/`
			}
			const matchThread = url.pathname.match(/^\/(.+?)\/res\/(.+)\.html$/)
			if (matchThread) {
				return `/${matchThread[1]}/${matchThread[2]}`
			}
		}
	},
	'4chan.org': {
		name: '4chan',
		getText(url) {
			const matchBoard = url.pathname.match(/^\/([^\/]+)$/)
			if (matchBoard) {
				return `/${matchBoard[1]}/`
			}
			const matchThread = url.pathname.match(/^\/(.+?)\/thread\/(.+)$/)
			if (matchThread) {
				return `/${matchThread[1]}/${matchThread[2]}`
			}
		}
	}
}

SERVICES['boards.4channel.org'] = SERVICES['4chan.org']
SERVICES['boards.4chan.org'] = SERVICES['4chan.org']
SERVICES['m.youtube.com'] = SERVICES['youtube.com']
SERVICES['arhivach.cf'] = SERVICES['archivach.org']
SERVICES['arhivach.ng'] = SERVICES['archivach.org']