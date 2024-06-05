export class ContentRequiredError extends Error {
	constructor() {
		super('Content is required')
	}
}