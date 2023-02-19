import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useUserData from '../../hooks/useUserData.js'
import useSettings from '../../hooks/useSettings.js'

import getMessages from '../../messages/index.js'

import { vote as voteForComment } from '../../redux/data.js'

import { notify, showError } from '../../redux/notifications.js'

export default function useVote({
	channelId,
	threadId,
	comment,
	locale
}) {
	const dispatch = useDispatch()
	const userData = useUserData()
	const userSettings = useSettings()

	const [vote, setVote] = useState(comment.vote)

	const onVote = useCallback(async (up) => {
		try {
			const voteAccepted = await dispatch(voteForComment({
				channelId,
				threadId,
				commentId: comment.id,
				up,
				userData,
				userSettings
			}))
			if (voteAccepted) {
				if (up) {
					comment.upvotes++
				} else {
					comment.downvotes++
				}
			} else {
				dispatch(notify(getMessages(locale).post.alreadyVoted))
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
		locale,
		dispatch
	])

	return [
		vote,
		onVote
	]
}