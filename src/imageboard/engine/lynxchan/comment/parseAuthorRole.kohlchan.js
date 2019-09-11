export default function parseRole(name) {
	switch (name) {
		case 'Root':
		case 'Administrator':
			return {
				role: 'administrator'
			}
		// For some weird reason `kohlchan.net` has both
		// "Board owner" and "Board Owner" roles.
		// "Board Owner" example:
		// https://kohlchan.net/t/res/1177.html#q1462
		case 'Board Owner':
		case 'Board owner':
			return {
				role: 'administrator',
				jurisdiction: 'board'
			}
		case 'Global volunteer':
			return {
				role: 'moderator'
			}
		case 'Board volunteer':
			return {
				role: 'moderator',
				jurisdiction: 'board'
			}
		default:
			if (name) {
				if (typeof window !== 'undefined') {
					// Report the error to `sentry.io`.
					setTimeout(() => { throw new Error(`Unknown role: ${name}`) }, 0)
				} else {
					console.warn(`Unknown role: ${name}`)
				}
			}
			return
	}
}