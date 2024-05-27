import type { State as GlobalState, CaptchaParameters } from '@/types';

import { ReduxModule } from 'react-pages'

type State = GlobalState['captcha']

const redux = new ReduxModule<State>()

export const setShowCaptchaModal = redux.simpleAction(
	(state, showCaptchaModal: State['showCaptchaModal']) => ({
		...state,
		showCaptchaModal
	})
)

export const setCaptcha = redux.simpleAction(
	(state, {
		captcha,
		captchaParameters,
		captchaSubmitId
	}: {
		captcha: State['captcha'],
		captchaParameters: CaptchaParameters,
		captchaSubmitId: State['captchaSubmitId']
	}) => ({
		...state,
		...captchaParameters,
		captcha,
		captchaSubmitId
	})
)

export default redux.reducer({})