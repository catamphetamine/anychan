import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import './Background.css'

export default function Background() {
	const backgroundLightMode = useSelector(state => state.app.backgroundLightMode)
	const backgroundDarkMode = useSelector(state => state.app.backgroundDarkMode)

	const backgroundLightModeClassName = useMemo(() => {
		if (backgroundLightMode) {
			return `Background--light--${getBackgroundVariantIdByName(backgroundLightMode)}`
		}
	}, [backgroundLightMode])

	const backgroundDarkModeClassName = useMemo(() => {
		if (backgroundDarkMode) {
			return `Background--dark--${getBackgroundVariantIdByName(backgroundDarkMode)}`
		}
	}, [backgroundDarkMode])

	return (
		<div className={classNames(
			'Background',
			backgroundLightModeClassName,
			backgroundDarkModeClassName, {
				'Background--light--show': backgroundLightMode,
				'Background--dark--show': backgroundDarkMode
			}
		)}>
			<div className="Background-backdrop"/>
			<div className="Background-gradient"/>
			<div className="Background-pattern"/>
		</div>
	)
}

function getBackgroundVariantIdByName(name) {
	return name.toLowerCase().replace(/[^a-z0-9]/g, '-')
}