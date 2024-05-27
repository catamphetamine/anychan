import type { Captcha, CaptchaFrame } from '@/types'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { Form, Field, Submit, FormComponent, FormActions, FormAction } from '../Form.js'
import TextButton from '../TextButton.js'
import FillButton from '../FillButton.js'

import { showError } from '../../redux/notifications.js'

import { useMessages } from '@/hooks'

import { frameCaptchaType } from './PropTypes.js'

import './FrameCaptcha.css'

export default function FrameCaptcha({
	slider,
	captcha,
	onSubmit,
	onCancel
}: FrameCaptchaProps) {
	const messages = useMessages()
	const dispatch = useDispatch()

	const onSubmitCaptchaSolution = useCallback(() => {
		dispatch(showError(messages.notImplementedForTheDataSource))
	}, [])

	return (
		<div>
			<iframe
				src={captcha.frameUrl}
				className="FrameCaptcha-frame"
			/>
			<Form onSubmit={onSubmitCaptchaSolution}>
				<FormActions>
					<FormAction>
						<TextButton onClick={onCancel}>
							{messages.actions.cancel}
						</TextButton>
					</FormAction>
					<FormAction>
						<Submit component={FillButton}>
							{messages.actions.submit}
						</Submit>
					</FormAction>
				</FormActions>
			</Form>
		</div>
	)
}

FrameCaptcha.propTypes = {
	slider: PropTypes.bool,
	captcha: frameCaptchaType.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired
}

interface FrameCaptchaProps {
	slider?: boolean,
	captcha: CaptchaFrame,
	onSubmit: (params: {
		captcha: Captcha,
		captchaSolution: string
	}) => void,
	onCancel: () => void
}