export default class CaptchaNotRequiredError extends Error {
	constructor() {
		super('CAPTCHA not required')
	}
}