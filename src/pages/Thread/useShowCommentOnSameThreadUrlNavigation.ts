import type { Channel, Thread, Comment } from '@/types'

import { useEffect } from 'react'

import useUrlBasePath from '../../hooks/useUrlBasePath.js'

// A user could be navigating browser history from a URL to a URL,
// and both URLs could belong to the same thread but different comments.
// In such cases, navigation won't be performed.
// In such cases, show the comment being navigated to.
// Example: `/4chan/a/123#456` -> `/4chan/a/123#789`.
export default function useShowCommentOnSameThreadUrlNavigation({
	channel,
	thread,
	showComment
}: {
	channel: Channel,
	thread: Thread,
	showComment: (commentId: Comment['id']) => void
}) {
	const urlBasePath = useUrlBasePath()

	useEffect(() => {
		const historyListener = (event: Event) => {
			const THREAD_PATH_REG_EXP = /^\/([^/]+)\/([^/]+)$/
			const COMMENT_ID_REG_EXP = /^#(\d+)$/
			const path = location.pathname.slice(urlBasePath.length)
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
		return () => {
			window.removeEventListener('popstate', historyListener)
		}
	}, [
		urlBasePath
	])
}