// There seem to be some weird TypeScript errors on the `<ContentSection/>` element and its children.
// The errors are because `ContentSection` component props aren't not defined in TypeScript
// and so it thinks that all of them are required while in reality some of those are optional.
// @ts-nocheck

import type { Background, UserSettingsJson } from '../../types/index.js'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Select from '../Select.js'
import { Switch } from 'react-responsive-ui'

import { FormStyle, FormComponent } from '../Form.js'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import useMessages from '../../hooks/useMessages.js'
import useSettings from '../../hooks/useSettings.js'

import { getDefaultBackgroundId } from '../../utility/settings/settingsDefaults.js'

import {
	getBackgrounds,
	applyBackground
} from '../../utility/background.js'

import {
	saveBackgroundLightMode,
	saveBackgroundDarkMode
} from '../../redux/settings.js'

export default function BackgroundSettings({
	type,
	settings
}: {
	type: 'dark' | 'light',
	settings: UserSettingsJson
}) {
	const userSettings = useSettings()
	const messages = useMessages()

	const dispatch = useDispatch()

	const value = type === 'dark' ? settings.backgroundDarkMode : settings.backgroundLightMode

	const [isEnabled, setEnabled] = useState(Boolean(value))
	const [isSwitchInteractive, setSwitchInteractive] = useState(true)

	async function onSelectBackground(id: Background['id']) {
		applyBackground(id, type, { dispatch, userSettings })
		if (type === 'light') {
			dispatch(saveBackgroundLightMode({ backgroundLightMode: id, userSettings }))
		} else {
			dispatch(saveBackgroundDarkMode({ backgroundDarkMode: id, userSettings }))
		}
	}

	const onSetEnabled = useCallback(async (isEnabledValue) => {
		if (isEnabledValue) {
			setEnabled(true)
			// Select a random background when enabling background.
			if (!value) {
				try {
					setSwitchInteractive(false)
					await onSelectBackground(getDefaultBackgroundId(type))
				} finally {
					setSwitchInteractive(true)
				}
			}
		} else {
			try {
				setSwitchInteractive(false)
				await onSelectBackground(null)
			} finally {
				setSwitchInteractive(true)
			}
			setEnabled(false)
		}
	}, [value, type])

	const options = getBackgrounds(type, { userSettings }).map((background) => ({
		value: background.id,
		label: background.name || background.id
	}))

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.background.title[type]}
			</ContentSectionHeader>

			<Switch
				value={isEnabled}
				onChange={onSetEnabled}
				disabled={!isSwitchInteractive}
				placement="left">
				{isEnabled ? messages.status.enabled : messages.status.disabled}
			</Switch>

			<FormStyle>
				<FormComponent>
					<Select
						value={value}
						options={options}
						onChange={onSelectBackground}
					/>
				</FormComponent>
			</FormStyle>
		</ContentSection>
	)
}

BackgroundSettings.propTypes = {
	type: PropTypes.oneOf(['dark', 'light']).isRequired,
	settings: PropTypes.object.isRequired
}