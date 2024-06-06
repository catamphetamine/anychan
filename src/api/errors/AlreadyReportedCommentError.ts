export class AlreadyReportedCommentError extends Error {
	constructor() {
		super('You\'ve already reported this comment')
	}
}