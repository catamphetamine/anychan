import { ReduxModule } from 'react-pages'

const redux = new ReduxModule()

export const setShowCaptchaModal = redux.simpleAction(
	(state, showCaptchaModal) => ({ ...state, showCaptchaModal })
)

export const setCaptcha = redux.simpleAction(
	(state, captcha) => ({ ...state, captcha })
)

export default redux.reducer({})