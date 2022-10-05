import { useState, useCallback } from 'react'

import getUserData from '../../UserData.js'

export default function useHide({
	channelId,
	threadId,
	comment,
	userData = getUserData()
}) {
	const [hidden, setHidden] = useState(comment.hidden)

	const onHide = useCallback(() => {
		if (commentId === threadId) {
			userData.addHiddenThread(channelId, threadId)
		} else {
			userData.addHiddenComment(channelId, threadId, comment.id)
		}
		setHidden(true)
	}, [])

	const onUnHide = useCallback(() => {
		if (commentId === threadId) {
			userData.removeHiddenThread(channelId, threadId)
		} else {
			userData.removeHiddenComment(channelId, threadId, comment.id)
		}
		setHidden(false)
	}, [])

	return {
		hidden,
		onHide,
		onUnHide
	}
}