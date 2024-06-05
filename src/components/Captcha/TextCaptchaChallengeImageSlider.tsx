import type { CaptchaWithImageSlider } from '@/types'

import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { imageSliderTextCaptchaType } from './PropTypes.js'

import './TextCaptchaChallengeImageSlider.css'

export default function TextCaptchaChallengeImageSlider({
	captcha,
	sliderDefaultPosition = 0.5,
	className
}: TextCaptchaChallengeImageSliderProps) {
	const backgroundSlideOffsetForSliderStartPosition = useMemo(() => {
		if (captcha) {
			// Background image width is wider than the foreground image width.
			return captcha.image.width - captcha.backgroundImage.width
		} else {
			return 0
		}
	}, [captcha])

	const backgroundSlideOffsetForSliderEndPosition = useMemo(() => {
		return 0
	}, [])

	const getBackgroundSlideOffsetForSliderValue = (value: number) => {
		return backgroundSlideOffsetForSliderStartPosition + (backgroundSlideOffsetForSliderEndPosition - backgroundSlideOffsetForSliderStartPosition) * value
	}

	const sliderDefaultValue = sliderDefaultPosition

	const [backgroundSlideOffset, setBackgroundSlideOffset] = useState(getBackgroundSlideOffsetForSliderValue(sliderDefaultValue))

	const onSliderValueChange = useCallback((value: number) => {
		setBackgroundSlideOffset(getBackgroundSlideOffsetForSliderValue(value))
	}, [
		backgroundSlideOffsetForSliderStartPosition,
		backgroundSlideOffsetForSliderEndPosition
	])

	const captchaSlidesContainerStyle = useMemo(() => {
		if (captcha) {
			const picture = captcha.image
			return {
				width: picture.width,
				height: picture.height
			}
		}
	}, [captcha])

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
				height: picture.height,
				left: backgroundSlideOffset + 'px'
			}
		}
	}, [captcha, backgroundSlideOffset])

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
		<div className={classNames(className, 'TextCaptchaChallengeImageSlider')}>
			<div style={captchaSlidesContainerStyle} className="TextCaptchaChallengeImageSlider-slides">
				<div style={captchaBackgroundImageDivStyle} className="TextCaptchaChallengeImageSlider-slide"/>
				<div style={captchaImageDivStyle} className="TextCaptchaChallengeImageSlider-slide"/>
			</div>
			<Slider defaultValue={sliderDefaultValue} onChange={onSliderValueChange}/>
		</div>
	)
}

TextCaptchaChallengeImageSlider.propTypes = {
	// frameUrl: PropTypes.string.isRequired,
	captcha: imageSliderTextCaptchaType.isRequired,
	sliderDefaultPosition: PropTypes.number,
	className: PropTypes.string
}

interface TextCaptchaChallengeImageSliderProps {
	captcha: CaptchaWithImageSlider,
	sliderDefaultPosition?: number,
	className?: string
}

const SLIDER_VALUE_MULTIPLIER = 100

function Slider({
	defaultValue,
	onChange
}: SliderProps) {
	const onChange_ = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(Number(event.target.value) / SLIDER_VALUE_MULTIPLIER)
	}, [
		onChange
	])

	return (
		<div>
			<input
				type="range"
				min={0}
				max={100}
				style={SLIDER_STYLE}
				defaultValue={defaultValue * SLIDER_VALUE_MULTIPLIER}
				onChange={onChange_}
			/>
		</div>
	)
}

interface SliderProps {
	defaultValue: number,
	onChange: (value: number) => void
}

Slider.propTypes = {
	defaultValue: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired
}

const SLIDER_STYLE = {
	position: 'relative',
	width: '100%',
	margin: 0,
	boxSizing: 'border-box',
	transition: 'box-shadow 10s ease-out 0s'
} as const