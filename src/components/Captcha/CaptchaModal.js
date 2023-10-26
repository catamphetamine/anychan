import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { Modal } from 'react-responsive-ui'
import Button from 'frontend-lib/components/Button.js'

import TextCaptcha from './TextCaptcha.js'
import { textCaptchaType } from './PropTypes.js'

import { getCaptchaSubmitFunction, removeCaptchaSubmitFunction } from '../../utility/captcha/captchaSubmitFunction.js'

export default function CaptchaModal({
	isOpen,
	close,
	captcha,
	captchaSubmitId
}) {
	const [isSubmitting, setSubmitting] = useState(false)

	const onSubmitCaptchaSolution = useCallback(async (...args) => {
		const onSubmit = getCaptchaSubmitFunction(captchaSubmitId)
		try {
			setSubmitting(true)
			await onSubmit(...args)
			close()
		} finally {
			setSubmitting(false)
		}
	}, [captchaSubmitId])

	const onClose = useCallback(() => {
		removeCaptchaSubmitFunction(captchaSubmitId)
		close()
	}, [
		close,
		captchaSubmitId
	])

	return (
		<Modal
			isOpen={isOpen}
			close={onClose}
			className="CaptchaModal"
			wait={isSubmitting}>
			<Modal.Content>
				{captcha && captcha.type === 'text' &&
					<TextCaptcha
						captcha={captcha}
						onSubmit={onSubmitCaptchaSolution}
						onCancel={onClose}
					/>
				}
			</Modal.Content>
		</Modal>
	)
}

CaptchaModal.propTypes = {
	isOpen: PropTypes.bool,
	close: PropTypes.func.isRequired,
	captcha: PropTypes.oneOfType([
		textCaptchaType
	]),
	captchaSubmitId: PropTypes.string
}