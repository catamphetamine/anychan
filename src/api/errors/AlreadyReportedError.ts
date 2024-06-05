export class AlreadyReportedError extends Error {
	constructor() {
		super('You\'ve already reported this comment')
	}
}