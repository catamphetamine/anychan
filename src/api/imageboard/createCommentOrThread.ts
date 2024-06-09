import type { Imageboard } from 'imageboard'
import type { CreateCommentParameters, CreateCommentResult, CreateThreadParameters, CreateThreadResult } from '../../types/index.js'

import {
	UnauthorizedError,
	AttachmentNotSupportedError,
	AttachmentRequiredError,
	AttachmentSizeLimitExceededError,
	AttachmentsCountExceededError,
	BannedError,
	CaptchaNotRequiredError,
	CaptchaSolutionIncorrectError,
	ChannelNotFoundError,
	ChannelIsLockedError,
	ContentBlockedError,
	ContentRequiredError,
	ContentLengthLimitExceededError,
	CommentNotFoundError,
	DuplicateAttachmentError,
	RateLimitError,
	ThreadNotFoundError,
	ThreadIsLockedError
} from '../errors/index.js'

export default async function createCommentOrThread(imageboard: Imageboard, {
	channelId,
	threadId,
	...rest
}: Partial<CreateCommentParameters> & Partial<CreateThreadParameters>): Promise<CreateCommentResult | CreateThreadResult> {
	try {
		if (threadId) {
			return await imageboard.createComment({
				boardId: channelId,
				threadId,
				...rest
			})
		} else {
			return await imageboard.createThread({
				boardId: channelId,
				...rest
			})
		}
	} catch (error) {
		switch (error.message) {
			case 'UNAUTHORIZED':
				throw new UnauthorizedError()
			case 'BANNED':
				throw new BannedError({
					banReason: error.banReason,
					banId: error.banId,
					banChannelId: error.banBoardId,
					banEndsAt: error.banEndsAt
				})
			case 'BOARD_NOT_FOUND':
				throw new ChannelNotFoundError({ channelId })
			case 'BOARD_IS_LOCKED':
				throw new ChannelIsLockedError()
			case 'THREAD_NOT_FOUND':
				throw new ThreadNotFoundError({ channelId, threadId })
			case 'CONTENT_IS_REQUIRED':
				throw new ContentRequiredError()
			case 'INCORRECT_CAPTCHA_SOLUTION':
				throw new CaptchaSolutionIncorrectError()
			case 'CAPTCHA_NOT_REQUIRED':
				throw new CaptchaNotRequiredError()
			case 'BOARD_MAX_POSTING_RATE_EXCEEDED':
				throw new RateLimitError()
			case 'THREAD_IS_LOCKED':
				throw new ThreadIsLockedError()
			case 'DUPLICATE_ATTACHMENTS_DETECTED':
				throw new DuplicateAttachmentError()
			case 'ATTACHMENT_REQUIRED':
				throw new AttachmentRequiredError()
			case 'ATTACHMENT_TYPE_NOT_SUPPORTED':
				throw new AttachmentNotSupportedError()
			case 'ATTACHMENT_SIZE_LIMIT_EXCEEDED':
				throw new AttachmentSizeLimitExceededError()
			case 'ATTACHMENTS_COUNT_LIMIT_EXCEEDED':
				throw new AttachmentsCountExceededError()
			case 'CONTENT_LENGTH_LIMIT_EXCEEDED':
				throw new ContentLengthLimitExceededError()
			case 'BLACKLISTED_WORD_DETECTED':
				throw new ContentBlockedError()
			default:
				throw error
		}
	}
}