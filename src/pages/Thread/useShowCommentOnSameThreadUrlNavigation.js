import { useEffect } from 'react'

import getBasePath from '../../utility/getBasePath'

// A user could be navigating browser history from a URL to a URL,
// and both URLs could belong to the same thread but different comments.
// In such cases, navigation won't be performed.
// In such cases, show the comment being navigated to.
// Example: `/4chan/a/123#456` -> `/4chan/a/123#789`.
export default function useShowCommentOnSameThreadUrlNavigation({
	channel,
	thread,
	showComment
}) {
	useEffect(() => {
		const historyListener = (event) => {
			const THREAD_PATH_REG_EXP = /^\/([^/]+)\/([^/]+)$/
			const COMMENT_ID_REG_EXP = /^#(\d+)$/
			const path = location.pathname.slice(getBasePath().length)
			let match = path.match(THREAD_PATH_REG_EXP)
			if (match) {
				const channelId = match[1]
				const threadId = parseInt(match[2])
				if (channelId === channel.id && threadId === thread.id) {
					if (COMMENT_ID_REG_EXP.test(location.hash)) {
						match = location.hash.match(COMMENT_ID_REG_EXP)
						if (match) {
							const commentId = parseInt(match[1])
							showComment(commentId)
						}
					}
				}
			}
		}
		window.addEventListener('popstate', historyListener)
		return () => window.removeEventListener('popstate', historyListener)
	}, [])
}