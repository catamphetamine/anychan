export default class InvalidAuthToken extends Error {
	constructor() {
		super('Invalid authentication token')
	}
}