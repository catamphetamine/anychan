import { useState, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import { notify } from '../../redux/notifications.js'

import useDataSource from '../../hooks/useDataSource.js'
import useSettings from '../../hooks/useSettings.js'
import useUserData from '../../hooks/useUserData.js'
import useMessages from '../../hooks/useMessages.js'

import useSubmitCommentOrThread from '../../hooks/useSubmitCommentOrThread.js'

import getMessages from '../../messages/getMessages.js'

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
	replyFormInputFieldName,
	initialShowReplyForm,
	onShowReplyFormChange,
	onReplyFormErrorDidChange: onReplyFormErrorDidChange_,
	onReplyFormInputHeightDidChange: onReplyFormInputHeightDidChange_,
	onRenderedContentDidChange,
	moreActionsButtonRef,
	refreshThread,
	onSubscribeToThread
}) {
	const dispatch = useDispatch()
	const dataSource = useDataSource()
	const userSettings = useSettings()
	const userData = useUserData()
	const messages = useMessages()

	const [showReplyForm, setShowReplyForm] = useState(initialShowReplyForm)
	const [replyFormInitialText, setReplyFormInitialText] = useState()

	const replyForm = useRef()

	useEffectSkipMount(() => {
		// Update reply form expanded state in `virtual-scroller` state.
		if (onShowReplyFormChange) {
			onShowReplyFormChange(showReplyForm)
		}
		// Reply form has been toggled: update `virtual-scroller` item height.
		if (onReplyFormInputHeightDidChange) {
			onReplyFormInputHeightDidChange()
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
			dispatch(notify(messages.threadIsArchived))
			return false
		}

		if (threadIsLocked) {
			dispatch(notify(messages.threadIsLocked))
			return false
		}

		if (threadExpired) {
			dispatch(notify(messages.threadExpired))
			return false
		}

		return true
	}, [
		threadIsArchived,
		threadIsLocked,
		threadExpired,
		dispatch,
		messages
	])

	const onReply = useCallback(({ selectedText } = {}) => {
		if (!checkCanReply()) {
			return
		}

		const replyTextPrefix = getReplyTextPrefix({
			commentId: comment.id,
			threadId,
			quoteText: selectedText
		})

		if (replyTextPrefix) {
			appendReplyTextPrefixToInputField(replyTextPrefix, {
				replyForm,
				setReplyFormInitialText,
				replyFormInputFieldName
			})
		}

		// If the reply form is already open, re-focus it.
		if (replyForm.current) {
			return replyForm.current.focus()
		}

		// Show the reply form.
		setShowReplyForm(true)
	}, [
		comment,
		threadId,
		checkCanReply,
		replyForm,
		replyFormInputFieldName,
		setReplyFormInitialText
	])

	const onAfterSubmit = useCallback(() => {
		setShowReplyForm(false)
		if (refreshThread) {
			refreshThread()
		}
	}, [refreshThread])

	const onSubmitReply = useSubmitCommentOrThread({
		channelId,
		threadId,
		inReplyToCommentId: comment.id,
		channelIsNotSafeForWork,
		isAble: checkCanReply,
		onAfterSubmit
	})

	const onReplyFormInputHeightDidChange = useCallback((height) => {
		if (onReplyFormInputHeightDidChange_) {
			onReplyFormInputHeightDidChange_(height)
		}
		if (onRenderedContentDidChange) {
			onRenderedContentDidChange()
		}
	}, [
		onReplyFormInputHeightDidChange_,
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
		replyFormInitialText,
		showReplyForm,
		onReply,
		onCancelReply,
		onSubmitReply,
		onReplyFormErrorDidChange,
		onReplyFormInputHeightDidChange
	}
}

function getReplyTextPrefix({ commentId, threadId, quoteText }) {
	let text = '>>' + commentId
	// if (commentId === threadId) {
	// 	text += ' (OP)'
	// }
	text += '\n'
	if (quoteText) {
		text += '>' + quoteText.trim().split('\n').join('>\n')
		text += '\n'
	}
	return text
}

function appendReplyTextPrefixToInputField(replyTextPrefix, {
	replyForm,
	setReplyFormInitialText,
	replyFormInputFieldName
}) {
	// If the `<PostForm/>` is already shown, update the `<input/>` text directly.
	// Otherwise, pass an `initialInputValue` property to the `<PostForm/>`.
	if (replyForm.current) {
		const getInputValue = () => replyForm.current.get(replyFormInputFieldName)
		const setInputValue = (value) => replyForm.current.set(replyFormInputFieldName, value)

		let currentText = getInputValue()
		if (currentText) {
			currentText = currentText.trim()
		}

		if (currentText) {
			// When a user has first double-clicked a post and the reply prefix is
			// something like ">>12345" but then they select some specific part
			// of that post and click "Reply" in the selected text's popup menu,
			// the resulting input value shouldn't be ">>12345 \n\n >>12345 \n >Quote"
			// and should instead be just ">>12345 \n >Quote".
			if (replyTextPrefix.indexOf(currentText) === 0) {
				setInputValue(replyTextPrefix)
			} else {
				setInputValue(currentText + '\n' + '\n' + replyTextPrefix)
			}
		} else {
			setInputValue(replyTextPrefix)
		}

		// Don't reset `replyFormInitialText`, otherwise the Form
		// would reset the input field's `value`.
		// setReplyFormInitialText(undefined)
	} else {
		setReplyFormInitialText(replyTextPrefix)
	}
}