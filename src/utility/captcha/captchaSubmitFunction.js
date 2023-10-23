const captchaSubmitFunctions = {}

export function getCaptchaSubmitFunction(id) {
	return captchaSubmitFunctions[id]
}

export function setCaptchaSubmitFunction(id, func) {
	captchaSubmitFunctions[id] = func
}

export function removeCaptchaSubmitFunction(id) {
	delete captchaSubmitFunctions[id]
}