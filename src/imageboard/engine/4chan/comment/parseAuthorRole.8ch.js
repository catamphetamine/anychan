// A capcode is a way of verifying someone as a privileged user.
// Normal users do not have the ability to post using a capcode.
export default function parseRole(capCode, { boardId }) {
	// https://github.com/ctrlcctrlv/infinity/blob/2bc5b6dbf31af50f54e73f88569496e19b143aad/inc/instance-config.php
	switch (capCode) {
		case 'Admin':
			return {
				role: 'administrator'
			}
		case 'Board Owner':
			return {
				role: 'administrator',
				domain: 'board'
			}
		case 'Global Volunteer':
			return {
				role: 'moderator'
			}
		case 'Board Moderator':
			return {
				role: 'moderator',
				domain: 'board'
			}
		case 'Board Volunteer':
			return {
				role: 'moderator',
				domain: 'board'
			}
		default:
			// Everyone on `/newsplus` seems to have the "Reporter" capcode.
			// It's not clear what it means. Maybe they're all moderators
			// and regular users can't post there.
			if (boardId === 'newsplus' && capCode === 'Reporter') {
				return {
					role: 'moderator',
					domain: 'board'
				}
			}
			if (capCode) {
				if (typeof window !== 'undefined') {
					// Report the error to `sentry.io`.
					setTimeout(() => { throw new Error(`Unknown 8ch.net "capcode": ${capCode}`) }, 0)
				} else {
					console.warn(`Unknown 8ch.net "capcode": ${capCode}`)
				}
			}
			return
	}
}