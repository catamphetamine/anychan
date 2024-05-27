export default class CaptchaSolutionIncorrectError extends Error {
	constructor() {
		super('Incorrect CAPTCHA solution')
	}
}