import type { Captcha, CaptchaFrame, CaptchaParameters } from '@/types'
import type { Dispatch } from 'redux'

import { setCaptcha, setShowCaptchaModal } from '../../redux/captcha.js'

import { setCaptchaSubmitFunction } from './captchaSubmitFunction.js'

export default function showCaptcha(
	captcha: Captcha | CaptchaFrame,
	captchaParameters: CaptchaParameters,
	{ dispatch, onSubmit }: { dispatch: Dispatch, onSubmit: Function }
) {
	const captchaSubmitId = getCaptchaSubmitId(captcha)
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

function getCaptchaSubmitId(captcha: Captcha | CaptchaFrame): string {
	if (captcha.type === 'frame') {
		return `auto${getNextCaptchaSubmitId()}`
	} else {
		return String(captcha.id)
	}
}