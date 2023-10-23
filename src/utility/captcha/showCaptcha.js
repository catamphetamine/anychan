import { setCaptcha, setShowCaptchaModal } from '../../redux/captcha.js'

import { setCaptchaSubmitFunction } from './captchaSubmitFunction.js'

export default function showCaptcha(parameters, { dispatch, onSubmit }) {
	// Currently, all CAPTCHAs have an `id`.
	// if (!parameters.id) {
	// 	parameters = {
	// 		...parameters,
	// 		id: String(getNextCaptchaId())
	// 	}
	// }
	setCaptchaSubmitFunction(parameters.id, onSubmit)
	dispatch(setCaptcha(parameters))
	dispatch(setShowCaptchaModal(true))
}

// // "Safe" refers to the ability of JavaScript to represent integers exactly
// // and to correctly compare them.
// const MAX_SAFE_INTEGER = 9007199254740991
//
// let captchaId = 0
// function getNextCaptchaId() {
// 	if (captchaId === MAX_SAFE_INTEGER) {
// 		captchaId = 0
// 	}
// 	captchaId++
// 	return captchaId
// }