import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { Form, Field, Submit, FormComponent, FormActions, FormAction } from '../Form.js'
import TextButton from '../TextButton.js'
import FillButton from '../FillButton.js'

import Picture from 'social-components-react/components/Picture.js'

import CaptchaSolutionIncorrectError from '../../api/errors/CaptchaSolutionIncorrectError.js'

import useMessages from '../../hooks/useMessages.js'

import './TextCaptcha.css'

export default function TextCaptcha({
	captcha,
	onSubmit,
	onCancel
}) {
	const messages = useMessages()

	const [captchaSolutionIncorrectError, setCaptchaSolutionIncorrectError] = useState(false)

	const initialCaptchaExpired = useMemo(() => {
		if (captcha.expiresAt) {
			return captcha.expiresAt.getTime() < Date.now()
		}
		return false
	}, [captcha])

	const [captchaExpired, setCaptchaExpired] = useState(initialCaptchaExpired)

	const captchaExpirationTimer = useRef()

	const captchaPicture = useMemo(() => ({
		title: messages.captcha,
		type: captcha.image.type,
		url: captcha.image.url,
		width: captcha.image.width,
		height: captcha.image.height
	}), [
		messages,
		captcha
	])

	const onSubmitCaptcha = useCallback(async ({ solution }) => {
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
			<Picture
				useSmallestSize
				useSmallestSizeExactDimensions
				picture={captchaPicture}
				className="TextCaptcha-picture"
			/>

			<Form
				autoFocus
				onSubmit={onSubmitCaptcha}>
				<FormComponent>
					<Field
						required
						type={captcha.characterSet === 'numeric' ? 'number' : 'text'}
						name="solution"
						disabled={captchaExpired}
						placeholder={messages.captchaSolution}
						error={captchaSolutionIncorrectError ? messages.captchaSolutionIncorrect : undefined}
						onChange={onInputValueChange}
					/>
				</FormComponent>
				{captchaExpired &&
					<FormComponent className="TextCaptcha-error">
						{messages.captchaExpired}
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

export const textCaptchaType = PropTypes.shape({
	id: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['text']).isRequired,
	characterSet: PropTypes.string,
	expiresAt: PropTypes.instanceOf(Date).isRequired,
	image: PropTypes.shape({
		type: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired
	}).isRequired
})

TextCaptcha.propTypes = {
	captcha: textCaptchaType.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired
}