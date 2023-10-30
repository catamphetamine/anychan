import UnauthorizedError from '../errors/UnauthorizedError.js'
import AttachmentNotSupportedError from '../errors/AttachmentNotSupportedError.js'
import AttachmentRequiredError from '../errors/AttachmentRequiredError.js'
import AttachmentSizeLimitExceededError from '../errors/AttachmentSizeLimitExceededError.js'
import AttachmentsCountExceededError from '../errors/AttachmentsCountExceededError.js'
import BannedError from '../errors/BannedError.js'
import CaptchaNotRequiredError from '../errors/CaptchaNotRequiredError.js'
import CaptchaSolutionIncorrectError from '../errors/CaptchaSolutionIncorrectError.js'
import ChannelNotFoundError from '../errors/ChannelNotFoundError.js'
import ChannelIsLockedError from '../errors/ChannelIsLockedError.js'
import ContentBlockedError from '../errors/ContentBlockedError.js'
import ContentRequiredError from '../errors/ContentRequiredError.js'
import ContentLengthLimitExceededError from '../errors/ContentLengthLimitExceededError.js'
import CommentNotFoundError from '../errors/CommentNotFoundError.js'
import DuplicateAttachmentError from '../errors/DuplicateAttachmentError.js'
import RateLimitError from '../errors/RateLimitError.js'
import ThreadNotFoundError from '../errors/ThreadNotFoundError.js'
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
				throw new ChannelNotFoundError(channelId)
			case 'BOARD_IS_LOCKED':
				throw new ChannelIsLockedError(channelId)
			case 'THREAD_NOT_FOUND':
				throw new ThreadNotFoundError({ channelId, threadId: rest.threadId })
			case 'COMMENT_NOT_FOUND':
				throw new CommentNotFoundError({ channelId, threadId: rest.threadId, commentId: rest.commentId })
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