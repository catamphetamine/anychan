import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'react-responsive-ui'

import {
	ContentSection,
	ContentSectionHeader,
	ContentSectionDescription
} from 'frontend-lib/components/ContentSection.js'

import applyLeftHanded from 'frontend-lib/utility/style/applyLeftHanded.js'

export default function LeftHandedSettings({
	messages,
	value,
	onChange: _onChange
}) {
	const onChange = useCallback((leftHanded) => {
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
	messages: PropTypes.object.isRequired,
	value: PropTypes.bool,
	onChange: PropTypes.func.isRequired
}