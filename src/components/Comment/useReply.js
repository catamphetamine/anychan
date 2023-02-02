import { useState, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { openLinkInNewTab } from 'web-browser-input'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import { notify } from '../../redux/notifications.js'

import getMessages from '../../messages/index.js'

import { getCommentUrl, getThreadUrl } from '../../provider.js'

export default function useReply({
	comment,
	threadId,
	channelId,
	channelIsNotSafeForWork,
	threadIsArchived,
	threadIsLocked,
	threadExpired,
	// Other properties.
	canReply,
	initialShowReplyForm,
	onShowReplyFormChange,
	onAfterShowOrHideReplyForm,
	moreActionsButtonRef,
	locale
}) {
	const dispatch = useDispatch()

	const [showReplyForm, setShowReplyForm] = useState(initialShowReplyForm)

	const replyForm = useRef()

	useEffectSkipMount(() => {
		// Update reply form expanded state in `virtual-scroller` state.
		if (onShowReplyFormChange) {
			onShowReplyFormChange(showReplyForm)
		}
		// Reply form has been toggled: update `virtual-scroller` item height.
		if (onAfterShowOrHideReplyForm) {
			onAfterShowOrHideReplyForm()
		}
		if (showReplyForm) {
			replyForm.current.focus()
		} else {
			if (moreActionsButtonRef) {
				if (moreActionsButtonRef.current) {
					moreActionsButtonRef.current.focus()
				}
			}
		}
	}, [showReplyForm])

	const onCancelReply = useCallback(() => {
		setShowReplyForm(false)
		// Reset the draft in `localStorage` here.
	}, [])

	const onReply = useCallback(() => {
		setShowReplyForm(true)
	}, [])

	const onSubmitReply = useCallback(({ content, quoteText }) => {
		if (threadIsArchived) {
			return dispatch(notify(getMessages(locale).threadIsArchived))
		}

		if (threadIsLocked) {
			return dispatch(notify(getMessages(locale).threadIsLocked))
		}

		if (threadExpired) {
			return dispatch(notify(getMessages(locale).threadExpired))
		}

		const text = getReplyText({
			commentId: comment.id,
			threadId,
			quoteText
		})
		console.log(text)

		// Disable reply form.
		// Show a spinner.
		// Trigger an auto-update.
		// Trigger an auto-update after a second.
		// Trigger an auto-update after 5 seconds.
		// Wait for the new comment to be fetched as part of thread auto-update.
		// Clear the reply form.
		// (optional) (if reply) Hide the reply form.
		// Focus the form (focus the "Reply" button of `elementRef.current`).

		let url
		if (comment.id === threadId) {
			url = getThreadUrl(channelId, threadId, {
				notSafeForWork: channelIsNotSafeForWork
			})
		} else {
			url = getCommentUrl(channelId, threadId, comment.id, {
				notSafeForWork: channelIsNotSafeForWork
			})
		}

		// try {
		// 	const commentId = await createComment(text, {
		// 		channelId,
		// 		threadId
		// 	})
		// 	const latestReadCommentId = UserData.getLatestReadCommentId(channelId, threadId)
		// 	const hasMoreUnreadComments = latestReadCommentId < thread.comments[thread.comments.length - 1]
		// 	if (!hasMoreUnreadComments) {
		// 		UserData.setLatestReadCommentId(channelId, threadId, commentId)
		// 	}
		// 	UserData.addOwnComment(channelId, threadId, commentId)
		// 	if (!UserData.getSubscribedThread(channelId, threadId)) {
		// 		onSubscribeToThread()
		// 	}
		// 	await dispatch(triggerAutoUpdateThreadRefreshIfAutoUpdateIsRunningOrRefreshThreadAndMaybeStartAutoUpdate())
		// } catch (error) {
		// 	console.error(error)
		// 	return notifyError(error)
		// }

		openLinkInNewTab(url)

		// if (showReplyForm) {
		// 	replyForm.current.focus()
		// } else {
		// 	setShowReplyForm(true)
		// }

		dispatch(notify(getMessages(locale).notImplemented))
	}, [
		channelId,
		channelIsNotSafeForWork,
		threadId,
		comment,
		locale,
		dispatch
	])

	if (!canReply) {
		return {}
	}

	return {
		replyForm,
		showReplyForm,
		onReply,
		onCancelReply,
		onSubmitReply
	}
}

function getReplyText({ commentId, threadId, quoteText }) {
	let text = '>>' + commentId
	// if (commentId === threadId) {
	// 	text += ' (OP)'
	// }
	text += '\n'
	if (quoteText) {
		text += '>' + quoteText.split('\n').join('>\n')
		text += '\n'
	}
	return text
}