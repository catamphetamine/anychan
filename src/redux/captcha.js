import { ReduxModule } from 'react-pages'

import _getCaptcha from '../api/getCaptcha.js'

const redux = new ReduxModule()

export const getCaptcha = redux.action(
	({
		channelId,
		threadId,
		...rest
	}) => async () => {
		return await _getCaptcha({
			channelId,
			threadId,
			...rest
		})
	}
)

export const setShowCaptchaModal = redux.simpleAction(
	(state, showCaptchaModal) => ({ ...state, showCaptchaModal })
)

export const setCaptcha = redux.simpleAction(
	(state, { captcha, captchaParameters, captchaSubmitId }) => ({
		...state,
		...captchaParameters,
		captcha,
		captchaSubmitId
	})
)

export default redux.reducer({})