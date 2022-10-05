import getUserData from '../../UserData.js'

import getLatestReadCommentIndex from './getLatestReadCommentIndex.js'

export default function getFirstNewCommentIndex(thread, { userData = getUserData() } = {}) {
	const latestReadCommentIndex = getLatestReadCommentIndex(thread, { userData })
	if (latestReadCommentIndex === undefined) {
		return 0
	}
	if (latestReadCommentIndex === thread.comments.length - 1) {
		return undefined
	}
	return latestReadCommentIndex + 1
}