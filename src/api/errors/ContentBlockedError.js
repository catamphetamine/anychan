export default class ContentBlockedError extends Error {
	constructor() {
		super('Content is blocked')
	}
}