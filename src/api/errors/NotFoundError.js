export default class NotFoundError extends Error {
	constructor() {
		super('Not found')
	}
}