export default class ContentTooLongError extends Error {
	constructor() {
		super('Content max size exceeded')
	}
}