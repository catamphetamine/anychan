import type { ChannelId, ThreadId, Captcha, TextCaptchaSolution } from '@/types'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '@/hooks'

import isDeployedOnDataSourceDomain from '../utility/dataSource/isDeployedOnDataSourceDomain.js'

import { CaptchaNotRequiredError, CaptchaSolutionIncorrectError } from "@/api/errors"

import { notify, showError } from '../redux/notifications.js'

import { useShowCaptcha, useDataSource, useMessages } from '@/hooks'

export default function useSubmitWithOrWithoutCaptcha({
	channelId,
	threadId,
	action
}: {
	channelId?: ChannelId,
	threadId?: ThreadId,
	action?: 'create-comment' | 'create-thread' | 'report-comment'
}) {
	const messages = useMessages()
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
					dispatch(notify('4chan.org CAPTCHA doesn\'t work on non-4chan.org websites.' + ' ' + 'Log in to bypass CAPTCHA: click the user icon at the top right of the sidebar.'))
					return
				}
				if (error instanceof CaptchaSolutionIncorrectError) {
					dispatch(showError(messages.captcha.form.error.incorrectSolution))
					await solveCaptchaAndSubmit()
				} else if (error instanceof CaptchaNotRequiredError) {
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
		messages,
		accessToken
	])
}