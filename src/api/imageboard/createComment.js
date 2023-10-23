import Imageboard from './Imageboard.js'

import AccessDeniedError from '../errors/AccessDeniedError.js'
import AttachmentNotSupportedError from '../errors/AttachmentNotSupportedError.js'
import AttachmentsCountExceededError from '../errors/AttachmentsCountExceededError.js'
import BannedError from '../errors/BannedError.js'
import CaptchaSolutionIncorrectError from '../errors/CaptchaSolutionIncorrectError.js'
import ChannelNotFoundError from '../errors/ChannelNotFoundError.js'
import CommentContentBlockedError from '../errors/CommentContentBlockedError.js'
import CommentRequiredError from '../errors/CommentRequiredError.js'
import DuplicateAttachmentError from '../errors/DuplicateAttachmentError.js'
import RateLimitError from '../errors/RateLimitError.js'
import ThreadIsLockedError from '../errors/ThreadIsLockedError.js'

export default async function createComment({
	dataSource,
	http,
	messages,
	userSettings,
	channelId,
	...rest
}) {
	try {
		return await Imageboard(dataSource, { messages, http, userSettings }).createComment({
			boardId: channelId,
			...rest
		})
	} catch (error) {
		switch (error.message) {
			case 'ACCESS_DENIED':
				throw new AccessDeniedError()
			case 'BANNED':
				throw new BannedError({
					banReason: error.banReason,
					banId: error.banId,
					banChannelId: error.banBoardId,
					banEndsAt: error.banEndsAt
				})
			case 'BOARD_NOT_FOUND':
				throw new ChannelNotFoundError(channelId)
			case 'COMMENT_IS_REQUIRED':
				throw new CommentRequiredError()
			case 'INCORRECT_CAPTCHA_SOLUTION':
				throw new CaptchaSolutionIncorrectError()
			case 'BOARD_MAX_POSTING_RATE_EXCEEDED':
				throw new RateLimitError()
			case 'THREAD_IS_LOCKED':
				throw new ThreadIsLockedError()
			case 'DUPLICATE_ATTACHMENTS_DETECTED':
				throw new DuplicateAttachmentError()
			case 'ATTACHMENT_TYPE_NOT_SUPPORTED':
				throw new AttachmentNotSupportedError()
			case 'TOO_MANY_ATTACHMENTS':
				throw new AttachmentsCountExceededError()
			case 'COMMENT_IS_TOO_LONG':
				throw new CommentContentSizeExceededError()
			case 'BLACKLISTED_WORD_DETECTED':
				throw new CommentContentBlockedError()
			default:
				throw error
		}
	}
}