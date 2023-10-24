import AccessDeniedError from '../errors/AccessDeniedError.js'
import AttachmentNotSupportedError from '../errors/AttachmentNotSupportedError.js'
import AttachmentsCountExceededError from '../errors/AttachmentsCountExceededError.js'
import BannedError from '../errors/BannedError.js'
import CaptchaSolutionIncorrectError from '../errors/CaptchaSolutionIncorrectError.js'
import ChannelNotFoundError from '../errors/ChannelNotFoundError.js'
import ContentBlockedError from '../errors/ContentBlockedError.js'
import ContentRequiredError from '../errors/ContentRequiredError.js'
import DuplicateAttachmentError from '../errors/DuplicateAttachmentError.js'
import RateLimitError from '../errors/RateLimitError.js'
import ThreadIsLockedError from '../errors/ThreadIsLockedError.js'

export default async function createCommentOrThread(imageboard, {
	channelId,
	...rest
}) {
	try {
		const parameters = {
			boardId: channelId,
			...rest
		}
		if (parameters.threadId) {
			return await imageboard.createComment(parameters)
		} else {
			return await imageboard.createThread(parameters)
		}
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
			case 'CONTENT_IS_REQUIRED':
				throw new ContentRequiredError()
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
				throw new ContentTooLongError()
			case 'BLACKLISTED_WORD_DETECTED':
				throw new ContentBlockedError()
			default:
				throw error
		}
	}
}