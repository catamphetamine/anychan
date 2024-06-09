import type { Captcha, Channel, ChannelId, ThreadId, CommentId, Thread, Comment, CreateThreadOrCommentCommonParameters } from '@/types'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { openLinkInNewTab } from 'web-browser-input'

import {
	UnauthorizedError,
	AttachmentNotSupportedError,
	AttachmentRequiredError,
	AttachmentSizeLimitExceededError,
	AttachmentsCountExceededError,
	BannedError,
	CaptchaSolutionIncorrectError,
	ChannelNotFoundError,
	ChannelIsLockedError,
	ContentBlockedError,
	ContentLengthLimitExceededError,
	ContentRequiredError,
	CommentNotFoundError,
	DuplicateAttachmentError,
	RateLimitError,
	ThreadNotFoundError,
	ThreadIsLockedError
 } from "@/api/errors"

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
	channel?: Channel;
	getThread?: () => Thread;
	channelId: ChannelId;
	threadId?: ThreadId;
	inReplyToCommentId?: CommentId;
	channelContainsExplicitContent?: boolean;
	isAble?: () => boolean;
	addSubscribedThread?: boolean;
	onAfterSubmit?: (result: { commentId: CommentId, threadId: ThreadId }) => void | Promise<void>;
}

// Returns a function that submits a thread or a comment.
export default function useCreateCommentOrThread({
	channel,
	getThread,
	channelId,
	threadId,
	inReplyToCommentId,
	channelContainsExplicitContent,
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
				attachments: attachmentFiles && attachmentFiles.length > 0 ? attachmentFiles : undefined,
				authorIsThreadAuthor: undefined,
				authorEmail: undefined,
				authorName: undefined,
				authorIconId: undefined,
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
					// These optional parameters could also be specified, or they could be omitted.
					// They're just listed here in case anyone would add them in some future.
					authorIsThreadAuthor: undefined,
					authorIconId: undefined
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
				// This error will be handled in `useSubmitWithOrWithoutCaptcha()` hook.
				throw error
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
						channelContainsExplicitContent
					})
				} else {
					return getThreadUrl(dataSource, {
						channelId,
						threadId,
						channelContainsExplicitContent
					})
				}
			} else {
				return getChannelUrl(dataSource, {
					channelId,
					channelContainsExplicitContent
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
		channelContainsExplicitContent,
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
		channel,
		channelId,
		threadId
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

		const isPostingSupported = threadId ? Boolean(dataSource.api.createComment) : Boolean(dataSource.api.createThread)

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
