import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'react-responsive-ui'

import autoDarkMode from 'frontend-lib/utility/style/autoDarkMode.js'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import useMessages from '../../hooks/useMessages.js'

export default function DarkModeSettings({
	autoDarkModeValue,
	onAutoDarkModeChange,
	onSetDarkMode
}) {
	const messages = useMessages()

	const _onAutoDarkModeChange = useCallback((value) => {
		onAutoDarkModeChange(value)
		autoDarkMode(value, {
			setDarkMode: onSetDarkMode
		})
	}, [onAutoDarkModeChange])

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.darkMode}
			</ContentSectionHeader>

			<Switch
				value={autoDarkModeValue}
				onChange={_onAutoDarkModeChange}
				placement="left">
				{messages.settings.darkMode.auto}
			</Switch>
		</ContentSection>
	)
}

DarkModeSettings.propTypes = {
	autoDarkModeValue: PropTypes.bool,
	onAutoDarkModeChange: PropTypes.func.isRequired,
	onSetDarkMode: PropTypes.func.isRequired
}