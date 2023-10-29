import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useUserData from '../../hooks/useUserData.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'
import useMessages from '../../hooks/useMessages.js'

import { vote as voteAction } from '../../redux/data.js'

import { notify, showError } from '../../redux/notifications.js'

export default function useVote({
	channelId,
	threadId,
	comment
}) {
	const dispatch = useDispatch()
	const userData = useUserData()
	const userSettings = useSettings()
	const dataSource = useDataSource()
	const messages = useMessages()

	const [vote, setVote] = useState(comment.vote)

	const onVote = useCallback(async (up) => {
		if (!dataSource.supportsVote()) {
			dispatch(notify(messages.notImplementedForTheDataSource))
			return
		}

		try {
			const voteAccepted = await dispatch(voteAction({
				channelId,
				threadId,
				commentId: comment.id,
				up,
				userData,
				userSettings,
				dataSource,
				messages
			}))
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

	return [
		vote,
		onVote
	]
}