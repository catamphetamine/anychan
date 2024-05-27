import type { Captcha, ChannelId, ThreadId, CommentId, Thread, Comment, CreateThreadOrCommentCommonParameters } from '../types/index.js'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { openLinkInNewTab } from 'web-browser-input'

import UnauthorizedError from '../api/errors/UnauthorizedError.js'
import AttachmentNotSupportedError from '../api/errors/AttachmentNotSupportedError.js'
import AttachmentRequiredError from '../api/errors/AttachmentRequiredError.js'
import AttachmentSizeLimitExceededError from '../api/errors/AttachmentSizeLimitExceededError.js'
import AttachmentsCountExceededError from '../api/errors/AttachmentsCountExceededError.js'
import BannedError from '../api/errors/BannedError.js'
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

import createComment from '../api/createComment.js'
import createThread from '../api/createThread.js'

import { showError, notify } from '../redux/notifications.js'

import getChannelUrl from '../utility/dataSource/getChannelUrl.js'
import getThreadUrl from '../utility/dataSource/getThreadUrl.js'
import getCommentUrl from '../utility/dataSource/getCommentUrl.js'

import {
	useDataSource,
	useMessages,
	useSettings,
	useUserData,
	useMessageFormatter,
	useSubmitWithOrWithoutCaptcha,
	useSelector
 } from '@/hooks'

import addSubscribedThread_ from '../utility/subscribedThread/addSubscribedThread.js'

import { getSubscribedThreads } from '../redux/subscribedThreads.js'

interface Parameters {
	getThread?: () => Thread;
	channelId: ChannelId;
	threadId?: ThreadId;
	inReplyToCommentId?: CommentId;
	channelIsNotSafeForWork?: boolean;
	isAble?: () => boolean;
	addSubscribedThread?: boolean;
	onAfterSubmit?: (result: { commentId: CommentId, threadId: ThreadId }) => void | Promise<void>;
}

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
}: Parameters) {
	const dataSource = useDataSource()
	const userSettings = useSettings()
	const userData = useUserData()
	const messages = useMessages()
	const dispatch = useDispatch()

	const accessToken = useSelector(state => state.auth.accessToken)

	const bannedMessageFormatter = useMessageFormatter(messages.yourAccountIsBanned)

	const submitCommentOrThread = useCallback(async ({
		content,
		attachmentFiles,
		captcha,
		captchaSolution
	}: {
		content?: string,
		attachmentFiles?: (File | Blob)[],
		captcha?: Captcha,
		captchaSolution?: string
	}) => {
		try {
			let parameters: Omit<CreateThreadOrCommentCommonParameters, 'proxyUrl'> = {
				channelId,
				accessToken,
				content,
				attachments: attachmentFiles,
				authorIsThreadAuthor: undefined,
				authorEmail: undefined,
				authorName: undefined,
				authorBadgeId: undefined,
				title: undefined,
				tags: undefined
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

			const result = await (threadId
				? createComment({
					...parameters,
					threadId,
					dataSource,
					userSettings
				})
				: createThread({
					...parameters,
					dataSource,
					userSettings
				})
			)

			dispatch(notify(threadId ? messages.createCommentSuccess : messages.createThreadSuccess))

			if (threadId) {
				return {
					commentId: result.id,
					threadId
				}
			} else {
				return {
					commentId: result.id,
					threadId: result.id
				}
			}
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

		const getExternalUrl = (commentId: Comment['id']) => {
			if (threadId) {
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
			} else {
				return getChannelUrl(dataSource, {
					channelId,
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
	}: {
		content?: string,
		attachmentFiles?: (File | Blob)[],
		captcha?: Captcha,
		captchaSolution?: string
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

		const commentId_ = result.commentId
		const threadId_ = result.threadId

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
				addSubscribedThread_({ thread: getThread(), dispatch, userData })
				dispatch(getSubscribedThreads({ userData }))
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

	const onSubmit = useSubmitWithOrWithoutCaptcha({
		channelId,
		threadId,
		action: threadId ? 'create-comment' : 'create-thread'
	})

	const onSubmitCommentOrThread = useCallback(async ({
		content,
		attachmentFiles
	}: {
		content?: string,
		attachmentFiles?: (File | Blob)[]
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

		await onSubmit(submitCommentOrThreadAndProcessResult, submitParameters)
	}, [
		dataSource,
		isAble,
		onPostingNotImplemented,
		submitCommentOrThreadAndProcessResult,
		onSubmit
	])

	return onSubmitCommentOrThread
}
