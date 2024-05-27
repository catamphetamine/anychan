import type { ChannelId, ThreadId, Captcha, TextCaptchaSolution } from '@/types'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '@/hooks'

import isDeployedOnDataSourceDomain from '../utility/dataSource/isDeployedOnDataSourceDomain.js'

import CaptchaNotRequiredError from '../api/errors/CaptchaNotRequiredError.js'
import CaptchaSolutionIncorrectError from '../api/errors/CaptchaSolutionIncorrectError.js'

import { notify } from '../redux/notifications.js'

import { useShowCaptcha, useDataSource } from '@/hooks'

export default function useSubmitWithOrWithoutCaptcha({
	channelId,
	threadId,
	action
}: {
	channelId?: ChannelId,
	threadId?: ThreadId,
	action?: 'create-comment' | 'create-thread' | 'report-comment'
}) {
	const dataSource = useDataSource()
	const dispatch = useDispatch()

	const accessToken = useSelector(state => state.auth.accessToken)

	const showCaptcha = useShowCaptcha({
		channelId,
		threadId
	})

	// Returns a function that receives arguments — `submit` and `submitParameters` —
	// and attempts to call `submit()` first without CAPTCHA and then with CAPTCHA.
	return useCallback(async (
		submit: (...args: any[]) => Promise<void>,
		submitParameters?: Record<string, any>
	) => {
		// Calls `submit()` without a CAPTCHA solution.
		const submitWithoutCaptchaSolution = async () => {
			await submit(submitParameters)
		}

		// Calls `submit()` with a CAPTCHA solution.
		const submitWithCaptchaSolution = async ({ captcha, captchaSolution }: { captcha: Captcha, captchaSolution: TextCaptchaSolution }) => {
			await submit({
				captcha,
				captchaSolution,
				...submitParameters
			})
		}

		// Shows a CAPTCHA and then calls `submit()` with the CAPTCHA solution that has been input by the user.
		const solveCaptchaAndSubmit = async () => {
			try {
				await showCaptcha({
					onSubmit: async ({ captcha, captchaSolution }: { captcha: Captcha, captchaSolution: TextCaptchaSolution }) => {
						await submitWithCaptchaSolution({
							captcha,
							captchaSolution
						})
					}
				})
			} catch (error) {
				if (dataSource.id === '4chan' && !isDeployedOnDataSourceDomain(dataSource)) {
					dispatch(notify('On 4chan, you must log in using your "pass" in order to be able to post a comment or a thread or to report a comment. To log in, click the user icon at the top of the sidebar.'))
					return
				}
				if (error instanceof CaptchaNotRequiredError) {
					await submitWithoutCaptchaSolution()
				} else {
					throw error
				}
			}
		}

		// If CAPTCHA is required then call `submit()` after solving a CAPTCHA.
		if (dataSource.isCaptchaRequired) {
			if (dataSource.isCaptchaRequired({
				action,
				isAuthenticated: Boolean(accessToken)
			})) {
				await solveCaptchaAndSubmit()
				return
			}
		}

		// Attempt to call `submit()` without a CAPTCHA.
		// If "CAPTCHA required" error is received, it reattempts to call `submit()` with a CAPTCHA.
		try {
			await submitWithoutCaptchaSolution()
		} catch (error) {
			if (error instanceof CaptchaSolutionIncorrectError) {
				await solveCaptchaAndSubmit()
			} else {
				throw error
			}
		}
	}, [
		showCaptcha,
		dataSource,
		dispatch,
		accessToken
	])
}