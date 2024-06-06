import type { Channel, Thread, Comment } from '../../types/index.js'

import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useUserData from '../../hooks/useUserData.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'
import useMessages from '../../hooks/useMessages.js'

import rateComment from '../../api/rateComment.js'

import { AlreadyRatedCommentError } from '@/api/errors'

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
		if (!dataSource.api.rateComment) {
			dispatch(notify(messages.notImplementedForTheDataSource))
			return
		}

		try {
			const voteAccepted = await rateComment({
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
					// `comment.upvotes` property could be `undefined` even when comment votes are enabled.
					comment.upvotes = (comment.upvotes || 0) + 1
				} else {
					// `comment.downvotes` property could be `undefined` even when comment votes are enabled.
					comment.downvotes = (comment.downvotes || 0) + 1
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
			if (error instanceof AlreadyRatedCommentError) {
				dispatch(showError(messages.alreadyRatedComment))
			} else {
				dispatch(showError(error.message))
			}
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