export default class AccessDeniedError extends Error {
	constructor() {
		super('Access Denied')
	}
}