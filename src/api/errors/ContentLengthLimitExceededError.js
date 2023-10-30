export default class ContentLengthLimitExceededError extends Error {
	constructor() {
		super('Content max length exceeded')
	}
}