import { useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { openLinkInNewTab } from 'web-browser-input'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import { notify, showError } from '../../redux/notifications.js'
import { createComment, getCaptcha } from '../../redux/data.js'

import AccessDeniedError from '../../api/errors/AccessDeniedError.js'
import AttachmentNotSupportedError from '../../api/errors/AttachmentNotSupportedError.js'
import AttachmentsCountExceededError from '../../api/errors/AttachmentsCountExceededError.js'
import BannedError from '../../api/errors/BannedError.js'
import CaptchaSolutionIncorrectError from '../../api/errors/CaptchaSolutionIncorrectError.js'
import ChannelNotFoundError from '../../api/errors/ChannelNotFoundError.js'
import CommentContentBlockedError from '../../api/errors/CommentContentBlockedError.js'
import CommentContentSizeExceededError from '../../api/errors/CommentContentSizeExceededError.js'
import CommentRequiredError from '../../api/errors/CommentRequiredError.js'
import DuplicateAttachmentError from '../../api/errors/DuplicateAttachmentError.js'
import RateLimitError from '../../api/errors/RateLimitError.js'
import ThreadIsLockedError from '../../api/errors/ThreadIsLockedError.js'

import useDataSource from '../../hooks/useDataSource.js'
import useSettings from '../../hooks/useSettings.js'
import useUserData from '../../hooks/useUserData.js'

import getMessages from '../../messages/index.js'

import getThreadUrl from '../../utility/dataSource/getThreadUrl.js'
import getCommentUrl from '../../utility/dataSource/getCommentUrl.js'

import showCaptcha from '../../utility/captcha/showCaptcha.js'

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
	locale,
	refreshThread,
	onSubscribeToThread
}) {
	const dispatch = useDispatch()
	const dataSource = useDataSource()
	const userSettings = useSettings()
	const userData = useUserData()

	const accessToken = useSelector(state => state.auth.accessToken)

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

	const onSubmitReply = useCallback(async ({
		content,
		attachmentFiles
	}) => {
		// Suppose a user opens a reply form and then the thread
		// changes its state to "locked". The reply form is still visible
		// but the user shouldn't be able to submit a reply.
		if (!checkCanReply()) {
			return
		}

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
			url = getThreadUrl(dataSource, {
				channelId,
				threadId,
				notSafeForWork: channelIsNotSafeForWork
			})
		} else {
			url = getCommentUrl(dataSource, {
				channelId,
				threadId,
				commentId: comment.id,
				notSafeForWork: channelIsNotSafeForWork
			})
		}

		const submitComment = async ({ captchaSolution, captcha } = {}) => {
			try {
				let parameters = {
					channelId,
					threadId,
					dataSource,
					userSettings,
					messages: getMessages(locale),
					authorIsThreadAuthor: undefined,
					accessToken: accessToken,
					authorEmail: undefined,
					authorName: undefined,
					title: undefined,
					authorBadgeId: undefined,
					content: content,
					tags: undefined,
					attachments: attachmentFiles
				}

				if (dataSource.id === '2ch') {
					parameters = {
						...parameters,
						// `captchaType` parameter seems to be required
						// even when there's no catpcha (for example,
						// when the user is logged in via a "passcode").
						captchaType: '2chcaptcha',
						authorIsThreadAuthor: undefined,
						authorBadgeId: undefined
					}
					if (captcha) {
						parameters = {
							...parameters,
							captchaId: captcha.id,
							captchaSolution
						}
					}
				}

				return await dispatch(createComment(parameters))
			} catch (error) {
				if (error instanceof AccessDeniedError) {
					dispatch(showError(getMessages(locale).accessDenied))
				} else if (error instanceof BannedError) {
					// Could also show the ban details here:
					// * banReason?: string
					// * banId?: any
					// * banChannelId?: string
					// * banEndsAt?: Date
					dispatch(showError(
						new IntlMessageFormat(getMessages(locale).yourAccountIsBanned, locale)
							.format({
								reason: error.banReason,
								banId: error.banId,
								boardId: error.banChannelId,
								untilDate: error.banEndsAt
							})
					))
				} else if (error instanceof ChannelNotFoundError) {
					dispatch(showError(getMessages(locale).boardNotFound))
				} else if (error instanceof ThreadIsLockedError) {
					dispatch(showError(getMessages(locale).threadIsLocked))
				} else if (error instanceof CommentRequiredError) {
					dispatch(showError(getMessages(locale).commentRequired))
				} else if (error instanceof CaptchaSolutionIncorrectError) {
					if (captcha) {
						// This error should be handled in the CAPTCHA input modal.
						throw error
					} else {
						dispatch(showError(getMessages(locale).captchaSolutionIncorrect))
					}
				} else if (error instanceof RateLimitError) {
					dispatch(showError(getMessages(locale).createCommentRateLimitExceeded))
				} else if (error instanceof DuplicateAttachmentError) {
					dispatch(showError(getMessages(locale).duplicateAttachmentsFound))
				} else if (error instanceof AttachmentNotSupportedError) {
					dispatch(showError(getMessages(locale).attachmentNotSupported))
				} else if (error instanceof AttachmentsCountExceededError) {
					dispatch(showError(getMessages(locale).attachmentsCountExceeded))
				} else if (error instanceof CommentContentSizeExceededError) {
					dispatch(showError(getMessages(locale).сommentContentSizeExceeded))
				} else if (error instanceof CommentContentBlockedError) {
					dispatch(showError(getMessages(locale).commentContentBlocked))
				} else {
					console.error(error)
					dispatch(showError(getMessages(locale).createCommentError))
				}
			}
		}

		const onSubmitComment = async (parameters) => {
			const result = await submitComment(parameters)

			// When an error notification is displayed,
			// the returned `result` is `undefined`.
			if (!result) {
				return
			}

			console.log('@@@ Comment:', result)

			const commentId = result.id

			// Mark the new comment as "own".
			userData.addOwnComment(channelId, threadId, commentId)

			// If "auto-subscribe to threads when posting a comment" setting
			// is turned on then automatically subscribe to the thread.
			// if (!userData.isSubscribedThread(channelId, threadId)) {
			// 	onSubscribeToThread()
			// }

			setShowReplyForm(false)

			dispatch(notify(getMessages(locale).createCommentSuccess))

			if (refreshThread) {
				refreshThread()
			}
		}

		// process.env.NODE_ENV !== 'production'
		if (dataSource.id === '2ch') {
			if (accessToken) {
				await onSubmitComment()
			} else {
				const captcha = await dispatch(getCaptcha({
					channelId,
					threadId,
					dataSource,
					userSettings,
					messages: getMessages(locale)
				}))

				// const captcha = {
				// 	"id": "b523714e9662a6e0741c3070b96a1c9c7c6591f2c11c9e2b15fdf577fa360e1662391df0a0fe929dc7f6bc6aa576ce851e0b50c9f3cedeefa7f4067b059cacf14ffc3633",
				// 	"type": "text",
				// 	"characterSet": "russian",
				// 	"expiresAt": new Date("2027-01-01T00:00:00.000Z"),
				// 	image: {
				// 		"url": "https://2ch.hk/api/captcha/2chcaptcha/show?id=b523714e9662a6e0741c3070b96a1c9c7c6591f2c11c9e2b15fdf577fa360e1662391df0a0fe929dc7f6bc6aa576ce851e0b50c9f3cedeefa7f4067b059cacf14ffc3633",
				// 		"type": "image/png",
				// 		"width": 270,
				// 		"height": 120
				// 	}
				// }

				console.log('@@@ CAPTCHA:', captcha)

				dispatch(notify('Справка: Капча `2ch.hk`, судя по всему, не работает на сайтах, отличных от `2ch.hk`: не грузит картинку, а даже если и грузит, то потом не принимает ответ.'))

				setTimeout(() => {
					dispatch(notify('Note: `2ch.hk` CAPTCHA image doesn\'t seem to work on a non-`2ch.hk` website: doesn\'t load image, and even if it does, it won\'t accept the solution.'))
				}, 0)

				// Show a CAPTCHA to the user.
				// If they solve it, then submit the new comment.
				showCaptcha({
					id: captcha.id,
					type: captcha.type,
					characterSet: captcha.characterSet,
					expiresAt: captcha.expiresAt,
					image: captcha.image
				}, {
					dispatch,
					onSubmit: onSubmitComment
				})
			}
		} else {
			// Show "Not implemented yet" placeholder message.
			await new Promise(resolve => setTimeout(resolve, 1000))
			dispatch(notify(getMessages(locale).notImplemented))

			// Open the thread at the original website so that the user could post their comment there.
			setTimeout(() => {
				openLinkInNewTab(url)
			}, 800)
		}
	}, [
		channelId,
		threadId,
		comment,
		dataSource,
		userSettings,
		userData,
		channelIsNotSafeForWork,
		dispatch,
		locale,
		checkCanReply,
		refreshThread,
		accessToken
	])

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