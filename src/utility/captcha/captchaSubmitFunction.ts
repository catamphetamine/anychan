const captchaSubmitFunctions: Record<string, Function> = {}

export function getCaptchaSubmitFunction(id: string) {
	return captchaSubmitFunctions[id]
}

export function setCaptchaSubmitFunction(id: string, func: Function) {
	captchaSubmitFunctions[id] = func
}

export function removeCaptchaSubmitFunction(id: string) {
	delete captchaSubmitFunctions[id]
}