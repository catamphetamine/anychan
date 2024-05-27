export default class ContentRequiredError extends Error {
	constructor() {
		super('Content is required')
	}
}