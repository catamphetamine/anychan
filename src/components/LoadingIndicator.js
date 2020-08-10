import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import LinearProgress from 'webapp-frontend/src/components/LinearProgress'
import { FadeInOut } from 'react-responsive-ui'

export default function Loading({
	indicator: Indicator,
	fadeOutDuration
}) {
	const initial = useSelector(({ preload }) => preload.initial)
	const pending = useSelector(({ preload }) => preload.pending)
	const immediate = useSelector(({ preload }) => preload.immediate)
	return (
		<div
			className={classNames('rrui__fixed-full-width', 'react-pages__loading', {
				'react-pages__loading--initial': initial,
				'react-pages__loading--shown': pending,
				'react-pages__loading--immediate': immediate
			})}>
			<FadeInOut show={pending} fadeOutDuration={fadeOutDuration}>
				<Indicator className="react-pages__loading-line"/>
			</FadeInOut>
		</div>
	)
}

Loading.propTypes = {
	indicator: PropTypes.func.isRequired,
	fadeOutDuration: PropTypes.number.isRequired
}

Loading.defaultProps = {
	indicator: LinearProgress,
	fadeOutDuration: 160
}