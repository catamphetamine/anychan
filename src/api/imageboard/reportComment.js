import AlreadyReportedError from '../errors/AlreadyReportedError.js'
import ContentRequiredError from '../errors/ContentRequiredError.js'

export default async function reportComment(imageboard, {
	channelId,
	...rest
}) {
	try {
		return await imageboard.reportComment({
			boardId: channelId,
			...rest
		})
	} catch (error) {
		switch (error.message) {
			case 'ALREADY_REPORTED':
				throw new AlreadyReportedError()
			case 'REPORT_CONTENT_REQUIRED':
				throw new ContentRequiredError()
			// case 'TOO_MANY_COMMENTS_BEING_REPORTED':
			// 	... currently the UI doesn't allow selecting multiple comments for a report ...
			default:
				throw error
		}
	}
}