import type { Imageboard } from 'imageboard'
import type { ReportCommentParameters, ReportCommentResult } from '../../types/index.js'

import {
	AlreadyReportedCommentError,
	CaptchaNotRequiredError,
	CaptchaSolutionIncorrectError,
	ContentRequiredError
} from '../errors/index.js'

export default async function reportComment(imageboard: Imageboard, {
	channelId,
	...rest
}: ReportCommentParameters): Promise<ReportCommentResult> {
	try {
		return await imageboard.reportComment({
			boardId: channelId,
			...rest
		})
	} catch (error) {
		switch (error.message) {
			case 'ALREADY_REPORTED':
				throw new AlreadyReportedCommentError()
			case 'REPORT_CONTENT_REQUIRED':
				throw new ContentRequiredError()
			case 'INCORRECT_CAPTCHA_SOLUTION':
				throw new CaptchaSolutionIncorrectError()
			case 'CAPTCHA_NOT_REQUIRED':
				throw new CaptchaNotRequiredError()
			// case 'TOO_MANY_COMMENTS_BEING_REPORTED':
			// 	... currently the UI doesn't allow selecting multiple comments for a report ...
			default:
				throw error
		}
	}
}