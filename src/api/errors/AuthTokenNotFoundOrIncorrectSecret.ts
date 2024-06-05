export class AuthTokenNotFoundOrIncorrectSecret extends Error {
	constructor() {
		super('Auth token not found or incorrect secret')
	}
}