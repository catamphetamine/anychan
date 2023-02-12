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
	onReplyFormErrorDidChange: onReplyFormErrorDidChange_,
	onReplyFormInputHeightChange: onReplyFormInputHeightChange_,
	onRenderedContentDidChange,
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
		if (onReplyFormInputHeightChange) {
			onReplyFormInputHeightChange()
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

	const checkCanReply = useCallback(() => {
		if (threadIsArchived) {
			dispatch(notify(getMessages(locale).threadIsArchived))
			return false
		}

		if (threadIsLocked) {
			dispatch(notify(getMessages(locale).threadIsLocked))
			return false
		}

		if (threadExpired) {
			dispatch(notify(getMessages(locale).threadExpired))
			return false
		}

		return true
	}, [
		threadIsArchived,
		threadIsLocked,
		threadExpired,
		dispatch,
		locale
	])

	const onReply = useCallback(() => {
		if (!checkCanReply()) {
			return
		}

		// If the reply form is already open, re-focus it.
		if (replyForm.current) {
			return replyForm.current.focus()
		}

		// Show the reply form.
		setShowReplyForm(true)
	}, [
		checkCanReply
	])

	const onSubmitReply = useCallback(async ({ content, quoteText }) => {
		// Suppose a user opens a reply form and then the thread
		// changes its state to "locked". The reply form is still visible
		// but the user shouldn't be able to submit a reply.
		if (!checkCanReply()) {
			return
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

		// if (showReplyForm) {
		// 	replyForm.current.focus()
		// } else {
		// 	setShowReplyForm(true)
		// }

		await new Promise(resolve => setTimeout(resolve, 1000))

		dispatch(notify(getMessages(locale).notImplemented))

		setTimeout(() => {
			openLinkInNewTab(url)
		}, 800)
	}, [
		channelId,
		threadId,
		comment,
		channelIsNotSafeForWork,
		dispatch,
		locale,
		checkCanReply
	])

	const onReplyFormInputHeightChange = useCallback((height) => {
		if (onReplyFormInputHeightChange_) {
			onReplyFormInputHeightChange_(height)
		}
		if (onRenderedContentDidChange) {
			onRenderedContentDidChange()
		}
	}, [
		onReplyFormInputHeightChange_,
		onRenderedContentDidChange
	])

	const onReplyFormErrorDidChange = useCallback((error) => {
		if (onReplyFormErrorDidChange_) {
			onReplyFormErrorDidChange_(error)
		}
		// Hiding or showing an error message could result in
		// hiding or showing an error element.
		if (onRenderedContentDidChange) {
			onRenderedContentDidChange()
		}
	}, [
		onReplyFormErrorDidChange_,
		onRenderedContentDidChange
	])

	if (!canReply) {
		return {}
	}

	return {
		replyForm,
		showReplyForm,
		onReply,
		onCancelReply,
		onSubmitReply,
		onReplyFormErrorDidChange,
		onReplyFormInputHeightChange
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