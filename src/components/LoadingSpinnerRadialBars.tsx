import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './LoadingSpinnerRadialBars.css'

export default function LoadingSpinnerRadialBars({
	// `className` shouldn't redefine `width`/`height`.
	// Instead, it should redefine `--LoadingSpinnerRadialBars-width` CSS variable value.
	className,
	...rest
}: LoadingSpinnerRadialBarsProps) {
	return (
		<div {...rest} className={classNames(className, 'LoadingSpinnerRadialBars')}>
			<div/>
			<div/>
			<div/>
			<div/>
			<div/>
			<div/>
			<div/>
			<div/>
			<div/>
			<div/>
			<div/>
			<div/>
		</div>
	)
}

LoadingSpinnerRadialBars.propTypes = {
	className: PropTypes.string
}

interface LoadingSpinnerRadialBarsProps {
	className?: string
}