import type { CaptchaWithImage, CaptchaWithImageSlider, CaptchaFrame } from '@/types'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error
import { Modal } from 'react-responsive-ui'

import FrameCaptcha from './FrameCaptcha.js'
import TextCaptcha from './TextCaptcha.js'
import { textCaptchaType, frameCaptchaType } from './PropTypes.js'

import { getCaptchaSubmitFunction, removeCaptchaSubmitFunction } from '../../utility/captcha/captchaSubmitFunction.js'

export default function CaptchaModal({
	isOpen,
	close,
	captcha,
	captchaSubmitId
}: CaptchaModalProps) {
	const [isSubmitting, setSubmitting] = useState(false)

	const onSubmitCaptchaSolution = useCallback(async (...args: any[]) => {
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
				{captcha && captcha.type === 'frame' &&
					<FrameCaptcha
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
		textCaptchaType,
		frameCaptchaType
	]),
	captchaSubmitId: PropTypes.string
}

interface CaptchaModalProps {
	isOpen?: boolean,
	close: () => void,
	captcha?: CaptchaWithImage | CaptchaWithImageSlider | CaptchaFrame,
	captchaSubmitId?: string
}