import { setCaptcha, setShowCaptchaModal } from '../../redux/captcha.js'

import { setCaptchaSubmitFunction } from './captchaSubmitFunction.js'

export default function showCaptcha(captcha, captchaParameters, { dispatch, onSubmit }) {
	const captchaSubmitId = String(captcha.id) || `auto${getNextCaptchaSubmitId()}`
	setCaptchaSubmitFunction(captchaSubmitId, onSubmit)
	dispatch(setCaptcha({ captcha, captchaParameters, captchaSubmitId }))
	dispatch(setShowCaptchaModal(true))
}

// "Safe" refers to the ability of JavaScript to represent integers exactly
// and to correctly compare them.
const MAX_SAFE_INTEGER = 9007199254740991

let captchaSubmitId = 0
function getNextCaptchaSubmitId() {
	if (captchaSubmitId === MAX_SAFE_INTEGER) {
		captchaSubmitId = 0
	}
	captchaSubmitId++
	return captchaSubmitId
}