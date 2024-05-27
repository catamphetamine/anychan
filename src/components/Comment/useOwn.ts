import type { Mode, ThreadId, ChannelId, CommentId } from "@/types"

import { useState, useCallback } from 'react'

import useUserData from '../../hooks/useUserData.js'

export default function useOwn({
	channelId,
	threadId,
	commentId,
	mode,
	onCommentOwnershipStatusChange
}: {
	channelId: ChannelId,
	threadId: ThreadId,
	commentId: CommentId,
	mode: Mode,
	onCommentOwnershipStatusChange: (commentId: CommentId, threadId: ThreadId, channelId: ChannelId, isOwn: boolean) => void
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

	// Maybe this state variable is not really required and could be removed.
	// Instead, it could use `comment.own` boolean flag as a source for the data.
	// Comments currently get forcefully re-rendered whenever their ownership status changes by calling `setOwn()`.
	const [markedAsOwn, setMarkedAsOwn] = useState(isOwn())

	return {
		isOwn: markedAsOwn,
		setOwn: onCommentOwnershipStatusChange ? (isOwn: boolean) => {
			setMarkedAsOwn(isOwn)
			onCommentOwnershipStatusChange(commentId, threadId, channelId, isOwn)
		} : undefined
	}
}