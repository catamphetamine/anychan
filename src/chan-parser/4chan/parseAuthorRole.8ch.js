// A capcode is a way of verifying someone as a privileged user.
// Normal users do not have the ability to post using a capcode.
export default function parseRole(capCode) {
	// https://github.com/ctrlcctrlv/infinity/blob/2bc5b6dbf31af50f54e73f88569496e19b143aad/inc/instance-config.php
	switch (capCode) {
		case 'Admin':
		case 'Board Owner':
			return 'administrator'
		case 'Global Volunteer':
		case 'Board Volunteer':
			return 'moderator'
		default:
			if (capCode) {
				console.error(`Unsupported "capcode": ${capCode}`)
			}
	}
}