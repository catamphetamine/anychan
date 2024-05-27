import type { CaptchaWithImageSlider } from '@/types'

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { imageSliderTextCaptchaType } from './PropTypes.js'

import './TextCaptchaChallengeImageSlider.css'

export default function TextCaptchaChallengeImageSlider({
	captcha,
	className
}: TextCaptchaChallengeImageSliderProps) {
	const captchaImageDivStyle = useMemo(() => {
		if (captcha) {
			const picture = captcha.image
			return {
				background: `url(${picture.url})`,
				width: picture.width,
				height: picture.height
			}
		}
	}, [captcha])

	const captchaBackgroundImageDivStyle = useMemo(() => {
		if (captcha) {
			const picture = captcha.backgroundImage
			return {
				background: `url(${picture.url})`,
				width: picture.width,
				height: picture.height
			}
		}
	}, [captcha])

	// {isLoading &&
	// 	<LoadingEllipsis
	// 		square
	// 		className="TextCaptchaChallengeImageSlider-loading"
	// 	/>
	// }
	// {error &&
	// 	<p className="TextCaptchaChallengeImageSlider-error">
	// 		{error}
	// 	</p>
	// }

	return (
		<div className={className}>
			<div style={captchaImageDivStyle}/>
			<div style={captchaBackgroundImageDivStyle}/>
			<Slider/>
		</div>
	)
}

TextCaptchaChallengeImageSlider.propTypes = {
	// frameUrl: PropTypes.string.isRequired,
	captcha: imageSliderTextCaptchaType.isRequired,
	className: PropTypes.string
}

interface TextCaptchaChallengeImageSliderProps {
	captcha: CaptchaWithImageSlider
	className?: string
}

function Slider() {
	return (
		<div>
			<input type="range" min={0} max={100} style={SLIDER_STYLE}/>
		</div>
	)
}

const SLIDER_STYLE = {
	position: 'relative',
	width: '100%',
	margin: 0,
	boxSizing: 'border-box',
	transition: 'box-shadow 10s ease-out 0s'
} as const