import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import LinearProgress from 'frontend-lib/components/LinearProgress.js'
import { FadeInOut } from 'react-responsive-ui'

export default function LoadingIndicator({
	show,
	indicator: Indicator,
	fadeOutDuration
}) {
	const initial = useSelector(state => state.preload.initial)
	const pending = useSelector(state => state.preload.pending)
	const immediate = useSelector(state => state.preload.immediate)

	return (
		<div
			className={classNames('rrui__fixed-full-width', 'react-pages__loading', {
				'react-pages__loading--initial': initial,
				'react-pages__loading--shown': show || pending,
				'react-pages__loading--immediate': immediate
			})}>
			<FadeInOut show={show || pending} fadeOutDuration={fadeOutDuration}>
				<Indicator className="react-pages__loading-line"/>
			</FadeInOut>
		</div>
	)
}

LoadingIndicator.propTypes = {
	show: PropTypes.bool,
	indicator: PropTypes.elementType.isRequired,
	fadeOutDuration: PropTypes.number.isRequired
}

LoadingIndicator.defaultProps = {
	indicator: LinearProgress,
	fadeOutDuration: 160
}