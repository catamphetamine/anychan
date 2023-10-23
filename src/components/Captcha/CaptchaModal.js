import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { Modal } from 'react-responsive-ui'
import Button from 'frontend-lib/components/Button.js'

import TextCaptcha, { textCaptchaType } from './TextCaptcha.js'

import { getCaptchaSubmitFunction } from '../../utility/captcha/captchaSubmitFunction.js'

export default function CaptchaModal({
	isOpen,
	close,
	captcha
}) {
	const [isSubmitting, setSubmitting] = useState(false)

	const onSubmitCaptchaSolution = useCallback(async (...args) => {
		const onSubmit = getCaptchaSubmitFunction(captcha.id)
		try {
			setSubmitting(true)
			await onSubmit(...args)
		} finally {
			setSubmitting(false)
		}
	}, [captcha])

	return (
		<Modal
			isOpen={isOpen}
			close={close}
			className="CaptchaModal"
			wait={isSubmitting}>
			<Modal.Content>
				{captcha && captcha.type === 'text' &&
					<TextCaptcha
						captcha={captcha}
						onSubmit={onSubmitCaptchaSolution}
						onCancel={close}
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
	])
}