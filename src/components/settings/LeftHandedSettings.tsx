import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error
import { Switch } from 'react-responsive-ui'

import {
	ContentSection,
	ContentSectionHeader,
	ContentSectionDescription
} from 'frontend-lib/components/ContentSection.js'

import applyLeftHanded from 'frontend-lib/utility/style/applyLeftHanded.js'

import useMessages from '../../hooks/useMessages.js'

export default function LeftHandedSettings({
	value,
	onChange: _onChange
}: LeftHandedSettingsProps) {
	const messages = useMessages()

	const onChange = useCallback((leftHanded: boolean) => {
		applyLeftHanded(leftHanded)
		_onChange(leftHanded)
	}, [_onChange])

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.leftHanded.title}
			</ContentSectionHeader>

			<Switch
				value={value}
				onChange={onChange}
				placement="left">
				{messages.settings.leftHanded.enable}
			</Switch>

			<ContentSectionDescription marginTop="medium">
				{messages.settings.leftHanded.description}
			</ContentSectionDescription>
		</ContentSection>
	)
}

LeftHandedSettings.propTypes = {
	value: PropTypes.bool,
	onChange: PropTypes.func.isRequired
}

interface LeftHandedSettingsProps {
	value?: boolean,
	onChange: (leftHanded: boolean) => void
}