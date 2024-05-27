import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './LoadingSpinnerCirclingComet.css'

export default function LoadingSpinnerCirclingComet({
	className,
	...rest
}: LoadingSpinnerCirclingCometProps) {
	return (
		<div {...rest} className={classNames(className, 'LoadingSpinnerCirclingComet')}>
			<LoadingSpinnerCirclingCometSvg/>
		</div>
	)
}

LoadingSpinnerCirclingComet.propTypes = {
	className: PropTypes.string
}

interface LoadingSpinnerCirclingCometProps {
	className?: string
}

const LoadingSpinnerCirclingCometSvg = () => {
	// The original values for `stopOpacity="1"` were `stopOpacity="0.5"`.
	// https://plasma.sberdevices.ru/ui-storybook/?path=/story/content-spinner--default&utm_campaign=gh-docs&utm_medium=readme&utm_source=github
	return (
		<svg viewBox="0 0 56 56" fill="none">
			<path fillRule="evenodd" clipRule="evenodd" d="M28 0C12.536 0 0 12.536 0 28s12.536 28 28 28h.055H28v-4C14.745 52 4 41.255 4 28S14.745 4 28 4V0z" fill="url(#LoadingSpinnerCirclingComet-gradient-1)"></path>
			<path d="M56 28c0 14.791-11.47 26.904-26 27.93-1.102.077-2-.825-2-1.93s.899-1.991 2-2.082C42.318 50.902 52 40.58 52 28 52 14.745 41.255 4 28 4V0c15.464 0 28 12.536 28 28z" fill="url(#LoadingSpinnerCirclingComet-gradient-2)"></path>
			<defs>
				<linearGradient id="LoadingSpinnerCirclingComet-gradient-1" x1="0" y1="56" x2="0" y2="0" gradientUnits="userSpaceOnUse">
					<stop stopColor="currentColor" stopOpacity="0"></stop>
					<stop offset="0.15" stopColor="currentColor" stopOpacity="0"></stop>
					<stop offset="0.95" stopColor="currentColor" stopOpacity="1"></stop>
					<stop offset="1" stopColor="currentColor" stopOpacity="1"></stop>
				</linearGradient>
				<linearGradient id="LoadingSpinnerCirclingComet-gradient-2" x1="28" y1="56" x2="28" y2="0" gradientUnits="userSpaceOnUse">
					<stop stopColor="currentColor"></stop>
					<stop offset="0.15" stopColor="currentColor"></stop>
					<stop offset="0.95" stopColor="currentColor" stopOpacity="1"></stop>
					<stop offset="1" stopColor="currentColor" stopOpacity="1"></stop>
				</linearGradient>
			</defs>
		</svg>
	)
}