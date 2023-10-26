import React, { useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

// import LoadingEllipsis from 'social-components-react/components/LoadingEllipsis.js'

import { imageSliderTextCaptchaType } from './PropTypes.js'

import './TextCaptchaChallengeImageSlider.css'

export default function TextCaptchaChallengeImageSlider({
	captcha,
	className
}) {
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
}