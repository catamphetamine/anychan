import type { CaptchaWithImage, CaptchaWithImageSlider, CaptchaFrame } from '@/types'
import type { ReactNode } from 'react'

import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'

// @ts-expect-error
import { Modal } from 'react-responsive-ui'

import FrameCaptcha from './FrameCaptcha.js'
import TextCaptcha from './TextCaptcha.js'
import { textCaptchaType, frameCaptchaType } from './PropTypes.js'

import { useDataSource, useLocale, useMessages, useMessage } from '@/hooks'

import isDeployedOnDataSourceDomain from '../../utility/dataSource/isDeployedOnDataSourceDomain.js'
import { getCaptchaSubmitFunction, removeCaptchaSubmitFunction } from '../../utility/captcha/captchaSubmitFunction.js'

import './CaptchaModal.css'

export default function CaptchaModal({
	isOpen,
	close,
	captcha,
	captchaSubmitId
}: CaptchaModalProps) {
	const dataSource = useDataSource()
	const locale = useLocale()
	const messages = useMessages()

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

	const logInOrSolveCaptchaMessageParameters = useMemo(() => ({
		logIn: (children: ReactNode) => (
			<Link target="_blank" to="/user">
				{children}
			</Link>
		)
	}), [])

	const logInOrSolveCaptchaMessage = useMessage(messages.captcha.logInOrSolveCaptcha, logInOrSolveCaptchaMessageParameters)

	return (
		<Modal
			isOpen={isOpen}
			close={onClose}
			className="CaptchaModal"
			wait={isSubmitting}>
			<Modal.Title>
				{messages.captcha.title}
			</Modal.Title>
			<Modal.Content>
				{dataSource.api.logIn && (
					<p className="CaptchaModal-subtitle">
						{logInOrSolveCaptchaMessage}
					</p>
				)}
				{dataSource.id === '2ch' && !isDeployedOnDataSourceDomain(dataSource) && (
					<p className="CaptchaModal-notes">
						{locale === 'ru' ? (
							'Картинки капчи 2ch.hk не загружаются на сайтах, отличных от 2ch.hk. Даже если бы картинки капчи загружались, сервер в любом случае не принимает даже верный ответ, говоря, что он неверный.'
						): (
							'2ch.hk CAPTCHA images don\'t seem to load on non-2ch.hk website. And even if they did, it doesn\'t accept any solution telling "Incorrect CAPTCHA solution".'
						)}
					</p>
				)}
				{dataSource.id === '4chan' && !isDeployedOnDataSourceDomain(dataSource) && (
					<p className="CaptchaModal-notes">
						{locale === 'ru' ? (
							'Капча 4chan.org не работает на сайтах, отличных от 4chan.org.'
						): (
							'4chan.org CAPTCHA doesn\'t work on non-4chan.org websites.'
						)}
					</p>
				)}
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