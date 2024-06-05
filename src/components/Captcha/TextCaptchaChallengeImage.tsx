import type { CaptchaWithImage } from '@/types'

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Picture from 'social-components-react/components/Picture.js'

import useMessages from '../../hooks/useMessages.js'

import { imageTextCaptchaType } from './PropTypes.js'

import './TextCaptchaChallengeImage.css'

export default function TextCaptchaChallengeImage({
	captcha,
	className
}: TextCaptchaChallengeImageProps) {
	const messages = useMessages()

	const picture = useMemo(() => {
		return {
			title: messages.captcha.title,
			type: captcha.image.type,
			url: captcha.image.url,
			width: captcha.image.width,
			height: captcha.image.height
		}
	}, [
		messages,
		captcha
	])

	return (
		<Picture
			useSmallestSize
			useSmallestSizeExactDimensions
			picture={picture}
			className={className}
		/>
	)
}

TextCaptchaChallengeImage.propTypes = {
	captcha: imageTextCaptchaType.isRequired,
	className: PropTypes.string
}

interface TextCaptchaChallengeImageProps {
	captcha: CaptchaWithImage,
	className?: string
}