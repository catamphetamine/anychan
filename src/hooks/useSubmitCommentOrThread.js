import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { openLinkInNewTab } from 'web-browser-input'

import UnauthorizedError from '../api/errors/UnauthorizedError.js'
import AttachmentNotSupportedError from '../api/errors/AttachmentNotSupportedError.js'
import AttachmentRequiredError from '../api/errors/AttachmentRequiredError.js'
import AttachmentSizeLimitExceededError from '../api/errors/AttachmentSizeLimitExceededError.js'
import AttachmentsCountExceededError from '../api/errors/AttachmentsCountExceededError.js'
import BannedError from '../api/errors/BannedError.js'
import CaptchaNotRequiredError from '../api/errors/CaptchaNotRequiredError.js'
import CaptchaSolutionIncorrectError from '../api/errors/CaptchaSolutionIncorrectError.js'
import ChannelNotFoundError from '../api/errors/ChannelNotFoundError.js'
import ChannelIsLockedError from '../api/errors/ChannelIsLockedError.js'
import ContentBlockedError from '../api/errors/ContentBlockedError.js'
import ContentLengthLimitExceededError from '../api/errors/ContentLengthLimitExceededError.js'
import ContentRequiredError from '../api/errors/ContentRequiredError.js'
import CommentNotFoundError from '../api/errors/CommentNotFoundError.js'
import DuplicateAttachmentError from '../api/errors/DuplicateAttachmentError.js'
import RateLimitError from '../api/errors/RateLimitError.js'
import ThreadNotFoundError from '../api/errors/ThreadNotFoundError.js'
import ThreadIsLockedError from '../api/errors/ThreadIsLockedError.js'

import { createComment, createThread } from '../redux/data.js'
import { showError, notify } from '../redux/notifications.js'
import { getCaptcha } from '../redux/captcha.js'

import getThreadUrl from '../utility/dataSource/getThreadUrl.js'
import getCommentUrl from '../utility/dataSource/getCommentUrl.js'
import showCaptcha from '../utility/captcha/showCaptcha.js'

import useDataSource from './useDataSource.js'
import useMessages from './useMessages.js'
import useLocale from './useLocale.js'
import useSettings from './useSettings.js'
import useUserData from './useUserData.js'
import useMessageFormatter from './useMessageFormatter.js'
import isDeployedOnDataSourceDomain from '../utility/dataSource/isDeployedOnDataSourceDomain.js'

import { subscribeToThread } from '../redux/subscribedThreads.js'

// Returns a function that submits a thread or a comment.
export default function useSubmitCommentOrThread({
	getThread,
	channelId,
	threadId,
	inReplyToCommentId,
	channelIsNotSafeForWork,
	isAble,
	addSubscribedThread,
	onAfterSubmit
}) {
	const dataSource = useDataSource()
	const userSettings = useSettings()
	const userData = useUserData()
	const messages = useMessages()
	const locale = useLocale()
	const dispatch = useDispatch()

	const bannedMessageFormatter = useMessageFormatter(messages.yourAccountIsBanned)

	const accessToken = useSelector(state => state.auth.accessToken)

	const submitCommentOrThread = useCallback(async ({
		content,
		attachmentFiles,
		captcha,
		captchaSolution
	}) => {
		try {
			let parameters = {
				dataSource,
				userSettings,
				messages,
				channelId,
				threadId,
				accessToken,
				authorIsThreadAuthor: undefined,
				authorEmail: undefined,
				authorName: undefined,
				title: undefined,
				authorBadgeId: undefined,
				content,
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

			const result = await dispatch(threadId ? createComment(parameters) : createThread(parameters))

			dispatch(notify(threadId ? messages.createCommentSuccess : messages.createThreadSuccess))

			return result
		} catch (error) {
			if (error instanceof UnauthorizedError) {
				dispatch(showError(messages.accessDenied))
			} else if (error instanceof BannedError) {
				// Could also show the ban details here:
				// * banReason?: string
				// * banId?: any
				// * banChannelId?: string
				// * banEndsAt?: Date
				dispatch(showError(bannedMessageFormatter({
					reason: error.banReason,
					banId: error.banId,
					boardId: error.banChannelId,
					untilDate: error.banEndsAt
				})))
			} else if (error instanceof ChannelNotFoundError) {
				dispatch(showError(messages.boardNotFound))
			} else if (error instanceof ThreadNotFoundError) {
				dispatch(showError(messages.threadNotFound))
			} else if (error instanceof CommentNotFoundError) {
				dispatch(showError(messages.commentNotFound))
			} else if (error instanceof ChannelIsLockedError) {
				dispatch(showError(messages.boardIsLocked))
			} else if (error instanceof ThreadIsLockedError) {
				dispatch(showError(messages.threadIsLocked))
			} else if (error instanceof ContentRequiredError) {
				dispatch(showError(messages.commentContentRequired))
			} else if (error instanceof CaptchaSolutionIncorrectError) {
				if (captcha) {
					// This error should be handled in the CAPTCHA input modal.
					throw error
				} else {
					dispatch(showError(messages.captchaSolutionIncorrect))
				}
			} else if (error instanceof RateLimitError) {
				dispatch(showError(threadId ? messages.createCommentRateLimitExceeded : messages.createThreadRateLimitExceeded))
			} else if (error instanceof DuplicateAttachmentError) {
				dispatch(showError(messages.duplicateAttachmentsFound))
			} else if (error instanceof AttachmentRequiredError) {
				dispatch(showError(messages.attachmentRequired))
			} else if (error instanceof AttachmentNotSupportedError) {
				dispatch(showError(messages.attachmentNotSupported))
			} else if (error instanceof AttachmentSizeLimitExceededError) {
				dispatch(showError(messages.attachmentSizeLimitExceededError))
			} else if (error instanceof AttachmentsCountExceededError) {
				dispatch(showError(messages.attachmentsCountExceeded))
			} else if (error instanceof ContentLengthLimitExceededError) {
				dispatch(showError(messages.сommentContentTooLong))
			} else if (error instanceof ContentBlockedError) {
				dispatch(showError(messages.commentContentBlocked))
			} else {
				console.error(error)
				dispatch(showError(threadId ? messages.createCommentError : messages.createThreadError))
			}
		}
	}, [
		dataSource,
		userSettings,
		messages,
		bannedMessageFormatter,
		channelId,
		threadId,
		accessToken
	])

	const onPostingNotImplemented = useCallback(async () => {
		// Show "Not implemented for this data source" message.
		await new Promise(resolve => setTimeout(resolve, 400))
		dispatch(notify(messages.notImplementedForTheDataSource))

		const getExternalUrl = (commentId) => {
			if (commentId && commentId !== threadId) {
				return getCommentUrl(dataSource, {
					channelId,
					threadId,
					commentId,
					notSafeForWork: channelIsNotSafeForWork
				})
			} else {
				return getThreadUrl(dataSource, {
					channelId,
					threadId,
					notSafeForWork: channelIsNotSafeForWork
				})
			}
		}

		// Open the thread at the original website so that the user could post their comment there.
		setTimeout(() => {
			openLinkInNewTab(getExternalUrl(inReplyToCommentId))
		}, 800)
	}, [
		channelId,
		threadId,
		inReplyToCommentId,
		messages,
		channelIsNotSafeForWork,
		dataSource
	])

	const submitCommentOrThreadAndProcessResult = useCallback(async ({
		content,
		attachmentFiles,
		captcha,
		captchaSolution
	} = {}) => {
		const result = await submitCommentOrThread({
			content,
			attachmentFiles,
			captcha,
			captchaSolution
		})

		// When an error notification is displayed,
		// the returned `result` is `undefined`.
		if (!result) {
			return
		}

		const isCreatingThread = !threadId

		const commentId_ = result.id
		const threadId_ = isCreatingThread ? commentId_ : threadId

		// Mark the new comment as "own".
		userData.addOwnComment(channelId, threadId_, commentId_)
		if (isCreatingThread) {
			// Mark the new thread as "own".
			// This should be done together with marking the root comment as "own".
			userData.addOwnThread(channelId, threadId_)
		}

		// When creating a thread or posting a comment, it might be convenient to automatically subscribe to that thread.
		// When posting a comment, thread subscription is added in this function.
		// When creating a thread, thread subscription is added after navigating to the new thread's page.

		// If "auto-subscribe to threads when posting a comment" setting
		// is turned on then automatically subscribe to the thread
		// when posting a new comment.
		if (!isCreatingThread && addSubscribedThread) {
			if (!userData.isSubscribedThread(channelId, threadId)) {
				dispatch(subscribeToThread(getThread(), { userData }))
			}
		}

		if (onAfterSubmit) {
			// Call `onAfterSubmit()` function.
			// If it is an `async` one then wait for it to finish.
			const onAfterSubmitResult = onAfterSubmit(result)
			if (onAfterSubmitResult && typeof onAfterSubmitResult.then === 'function') {
				await onAfterSubmitResult
			}
		}
	}, [
		dispatch,
		submitCommentOrThread,
		userData,
		channelId,
		threadId,
		getThread,
		onAfterSubmit
	])

	const onSubmitCommentOrThread = useCallback(async ({
		content,
		attachmentFiles
	}) => {
		const submitParameters = {
			content,
			attachmentFiles
		}

		// Suppose a user opens a reply form and then the thread
		// changes its state to "locked". The reply form is still visible
		// but the user shouldn't be able to submit a reply.
		if (isAble) {
			if (!isAble()) {
				return
			}
		}

		const isPostingSupported = threadId ? dataSource.supportsCreateComment() : dataSource.supportsCreateThread()

		if (!isPostingSupported) {
			await onPostingNotImplemented()
			return
		}

		// When user is authenticated, there's no need to solve a CAPTCHA.
		if (accessToken) {
			await submitCommentOrThreadAndProcessResult(submitParameters)
			return
		}

		const toAbsoluteUrl = (url) => {
			// Convert a relative URL to an absolute one.
			if (url[0] === '/' && url[1] !== '/') {
				return dataSource.getAbsoluteUrl(url, { notSafeForWork: channelIsNotSafeForWork })
			}
			// If it's already an absolute URL, return it as is.
			return url
		}

		const getCaptcha_ = async () => {
			if (dataSource.getCaptchaFrameUrl) {
				const captchaFrameUrl = dataSource.getCaptchaFrameUrl({
					channelId,
					threadId
				})

				return {
					captcha: {
						type: 'text',
						frameUrl: toAbsoluteUrl(captchaFrameUrl)
					}
				}
			} else {
				const {
					captcha,
					...captchaParameters
				} = await dispatch(getCaptcha({
					channelId,
					threadId,
					dataSource,
					userSettings,
					messages
				}))

				// Convert CAPTCHA image URL to an absolute one.
				if (captcha.image && captcha.image.url) {
					captcha.image.url = toAbsoluteUrl(captcha.image.url)
				}

				return {
					captcha,
					captchaParameters
				}
			}
		}

		const getCaptchaAndShowIt = async () => {
			const {
				captcha,
				captchaParameters
			} = await getCaptcha_()

			// Testing `2ch.hk`:
			// captcha = {
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
			if (captchaParameters && Object.keys(captchaParameters).length > 0) {
				console.log('@@@ CAPTCHA parameters:', captchaParameters)
			}

			if (dataSource.id === '2ch' && !isDeployedOnDataSourceDomain(dataSource)) {
				if (locale === 'ru') {
					dispatch(notify('Справка: Капча `2ch.hk`, судя по всему, не работает на сайтах, отличных от `2ch.hk`: не грузит картинку, а даже если и грузит, то потом не принимает ответ. Поэтому на текущий момент постинг работает только из-под "пасскода". Войти по "пасскоду" можно нажав на значок пользователя вверху сайдбара.'))
				} else {
					dispatch(notify('Note: `2ch.hk` CAPTCHA image doesn\'t seem to work on a non-`2ch.hk` website: doesn\'t load image, and even if it does, it won\'t accept the solution. So currently, one could only post after logging in with a "passcode". To do that, click the user icon at the top of the sidebar.'))
				}
			}

			// Show a CAPTCHA to the user.
			// If they solve it, then submit the new comment.
			showCaptcha(captcha, captchaParameters, {
				dispatch,
				onSubmit: async ({
					captcha,
					captchaSolution
				}) => {
					return await submitCommentOrThreadAndProcessResult({
						captcha,
						captchaSolution,
						...submitParameters
					})
				}
			})
		}

		try {
			await getCaptchaAndShowIt()
		} catch (error) {
			if (dataSource.id === '4chan' && !isDeployedOnDataSourceDomain(dataSource)) {
				dispatch(notify('On 4chan, you must log in using your "pass" in order to be able to post a comment or a thread. To log in, click the user icon at the top of the sidebar.'))
				return
			}
			if (error instanceof CaptchaNotRequiredError) {
				await submitCommentOrThreadAndProcessResult(submitParameters)
			} else {
				throw error
			}
		}
	}, [
		channelId,
		threadId,
		dataSource,
		userSettings,
		messages,
		locale,
		isAble,
		accessToken,
		submitCommentOrThreadAndProcessResult,
		onPostingNotImplemented
	])

	return onSubmitCommentOrThread
}
