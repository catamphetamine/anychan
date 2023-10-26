import { useState, useCallback } from 'react'

import useUserData from '../../hooks/useUserData.js'

export default function useOwn({
	channelId,
	threadId,
	commentId,
	mode
}) {
	const userData = useUserData()

	const isOwn = useCallback(() => {
		if (mode === 'thread') {
			return userData.isOwnComment(channelId, threadId, commentId)
		} else {
			return userData.isOwnThread(channelId, threadId)
		}
	}, [
		mode,
		userData,
		channelId,
		threadId,
		commentId
	])

	const [markedAsOwn, setMarkedAsOwn] = useState(isOwn())

	return {
		isOwn: markedAsOwn,
		setOwn: setMarkedAsOwn
	}
}