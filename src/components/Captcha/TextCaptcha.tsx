import type { Captcha, CaptchaWithImage, CaptchaWithImageSlider } from '@/types'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { Form, Field, Submit, FormComponent, FormActions, FormAction } from '../Form.js'
import TextButton from '../TextButton.js'
import FillButton from '../FillButton.js'

import TextCaptchaChallengeImage from './TextCaptchaChallengeImage.js'
import TextCaptchaChallengeImageSlider from './TextCaptchaChallengeImageSlider.js'

import { CaptchaSolutionIncorrectError } from "@/api/errors"

import { useMessages } from '@/hooks'

import { textCaptchaType } from './PropTypes.js'

import './TextCaptcha.css'

export default function TextCaptcha({
	slider,
	captcha,
	onSubmit,
	onCancel
}: TextCaptchaProps) {
	const messages = useMessages()

	const [captchaSolutionIncorrectError, setCaptchaSolutionIncorrectError] = useState(false)

	const initialCaptchaExpired = useMemo(() => {
		if (captcha.expiresAt) {
			return captcha.expiresAt.getTime() < Date.now()
		}
		return false
	}, [captcha])

	const [captchaExpired, setCaptchaExpired] = useState(initialCaptchaExpired)

	const captchaExpirationTimer = useRef<number>()

	const onSubmitCaptcha = useCallback(async ({ solution }: { solution: string }) => {
		try {
			setCaptchaSolutionIncorrectError(false)
			await onSubmit({
				captcha,
				captchaSolution: solution
			})
		} catch (error) {
			if (error instanceof CaptchaSolutionIncorrectError) {
				setCaptchaSolutionIncorrectError(true)
			} else {
				throw error
			}
		}
	}, [
		captcha
	])

	const onInputValueChange = useCallback(() => {
		setCaptchaSolutionIncorrectError(false)
	}, [])

	useEffect(() => {
		// Start CAPTCHA expiration timer.
		if (captcha.expiresAt) {
			captchaExpirationTimer.current = setTimeout(() => {
				captchaExpirationTimer.current = undefined
				setCaptchaExpired(true)
			}, captcha.expiresAt.getTime() - Date.now())
		}

		return () => {
			// Stop CAPTCHA expiration timer.
			if (captchaExpirationTimer.current) {
				clearTimeout(captchaExpirationTimer.current)
				captchaExpirationTimer.current = undefined
			}
		}
	}, [])

	return (
		<div className="TextCaptcha">
			{captcha.challengeType === 'image' &&
				<TextCaptchaChallengeImage
					captcha={captcha}
					className="TextCaptcha-challenge"
				/>
			}

			{captcha.challengeType === 'image-slider' &&
				<TextCaptchaChallengeImageSlider
					captcha={captcha}
					className="TextCaptcha-challenge"
				/>
			}

			<Form
				autoFocus
				onSubmit={onSubmitCaptcha}>
				<FormComponent>
					<Field
						required
						type={captcha.characterSet === 'numeric' ? 'number' : 'text'}
						name="solution"
						disabled={captchaExpired}
						placeholder={messages.captcha.form.solution}
						error={captchaSolutionIncorrectError ? messages.captcha.form.error.incorrectSolution : undefined}
						onChange={onInputValueChange}
					/>
				</FormComponent>
				{captchaExpired &&
					<FormComponent className="TextCaptcha-error">
						{messages.captcha.form.error.expired}
					</FormComponent>
				}
				<FormActions>
					<FormAction>
						<TextButton onClick={onCancel}>
							{messages.actions.cancel}
						</TextButton>
					</FormAction>
					<FormAction>
						<Submit component={FillButton} disabled={captchaExpired}>
							{messages.actions.submit}
						</Submit>
					</FormAction>
				</FormActions>
			</Form>
		</div>
	)
}

TextCaptcha.propTypes = {
	slider: PropTypes.bool,
	captcha: textCaptchaType.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired
}

interface TextCaptchaProps {
	slider?: boolean,
	captcha: CaptchaWithImage | CaptchaWithImageSlider,
	onSubmit: (params: {
		captcha: Captcha,
		captchaSolution: string
	}) => void,
	onCancel: () => void
}