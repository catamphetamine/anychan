import type { Channel, Thread, Comment } from '../../types/index.js'

import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useUserData from '../../hooks/useUserData.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'
import useMessages from '../../hooks/useMessages.js'

import voteForComment from '../../api/voteForComment.js'

import { notify, showError } from '../../redux/notifications.js'

interface Parameters {
	channelId: Channel['id'];
	threadId: Thread['id'];
	comment: Comment;
}

export default function useVote({
	channelId,
	threadId,
	comment
}: Parameters) {
	const dispatch = useDispatch()
	const userData = useUserData()
	const userSettings = useSettings()
	const dataSource = useDataSource()
	const messages = useMessages()

	const [vote, setVote] = useState(comment.vote)

	const onVote = useCallback(async (up: boolean) => {
		if (!dataSource.api.voteForComment) {
			dispatch(notify(messages.notImplementedForTheDataSource))
			return
		}

		try {
			const voteAccepted = await voteForComment({
				up,
				channelId,
				threadId,
				commentId: comment.id,
				dataSource,
				userSettings
			})

			// If the vote has been accepted then mark this comment as "voted" in user data.
			// If the vote hasn't been accepted due to "already voted"
			// then also mark this comment as "voted" in user data.
			userData.setCommentVote(channelId, threadId, comment.id, up ? 1 : -1) // , { archive: false })

			if (voteAccepted) {
				if (up) {
					comment.upvotes++
				} else {
					comment.downvotes++
				}
			} else {
				dispatch(notify(messages.post.alreadyVoted))
			}
			// If the vote has been accepted then mark this comment as "voted".
			// If the vote hasn't been accepted due to "already voted"
			// then also mark this comment as "voted".
			comment.vote = up
			setVote(comment.vote)
		} catch (error) {
			dispatch(showError(error.message))
		}
	}, [
		channelId,
		threadId,
		comment,
		messages,
		dispatch,
		dataSource,
		userData,
		userSettings
	])

	return {
		vote,
		onVote
	}
}