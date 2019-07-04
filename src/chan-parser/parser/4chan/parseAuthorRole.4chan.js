// https://www.4chan.org/faq#capcode
// A capcode is a way of verifying someone as a 4chan team member.
// Normal users do not have the ability to post using a capcode.
// Janitors do not receive a capcode.
export default function parseRole(capCode) {
	switch (capCode) {
		case 'admin':
		case 'founder':
		case 'developer':
			return 'administrator'
		case 'mod':
		case 'manager':
			return 'moderator'
		default:
			if (capCode) {
				if (typeof window !== 'undefined') {
					// Report the error to `sentry.io`.
					setTimeout(() => { throw new Error(`Unknown 4chan.org "capcode": ${capCode}`) }, 0)
				} else {
					console.warn(`Unknown 4chan.org "capcode": ${capCode}`)
				}
			}
	}
}