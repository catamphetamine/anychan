export class ContentBlockedError extends Error {
	constructor() {
		super('Content is blocked')
	}
}