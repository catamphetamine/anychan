import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// @ts-expect-error
import { FadeInOut } from 'react-responsive-ui'

import LinearProgress from 'frontend-lib/components/LinearProgress.js'

import './PageLoading.css'

export default function PageLoading({
	initial,
	show,
	showAnimationDelay,
	hideAnimationDuration = 160
}: PageLoadingProps) {
	return (
		<div
			className={classNames('rrui__fixed-full-width', 'PageLoading', {
				'PageLoading--show': show,
				'PageLoading--initial': initial,
				'PageLoading--showImmediately': showAnimationDelay === 0
			})}>
			<FadeInOut show={show} fadeOutDuration={hideAnimationDuration}>
				<LinearProgress/>
			</FadeInOut>
		</div>
	)
}

PageLoading.propTypes = {
	initial: PropTypes.bool,
	show: PropTypes.bool,
	hideAnimationDuration: PropTypes.number,
	showAnimationDelay: PropTypes.number
}

interface PageLoadingProps {
	initial?: boolean,
	show?: boolean,
	hideAnimationDuration?: number,
	showAnimationDelay?: number
}