import React from 'react'
import classNames from 'classnames'

import './LoadingSpinnerRadialBars.css'

export default function LoadingSpinnerRadialBars({
	// `className` shouldn't redefine `width`/`height`.
	// Instead, it should redefine `--LoadingSpinnerRadialBars-width` CSS variable value.
	className,
	...rest
}) {
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