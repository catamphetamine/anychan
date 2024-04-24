import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import Select from '../Select.js'

import applyFontSize, { FONT_SIZES } from 'frontend-lib/utility/style/applyFontSize.js'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import useMessages from '../../hooks/useMessages.js'

export default function FontSizeSettings({
	value,
	onChange
}) {
	const messages = useMessages()

	const saveFontSize = useCallback((fontSize) => {
		applyFontSize(fontSize)
		onChange(fontSize)
	}, [onChange])

	const options = useMemo(() => {
		return FONT_SIZES.map((fontSize) => ({
			value: fontSize,
			label: messages.settings.fontSize[fontSize]
		}))
	}, [messages])

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.fontSize.title}
			</ContentSectionHeader>
			<Select
				value={value}
				options={options}
				onChange={saveFontSize}
			/>
		</ContentSection>
	)
}

FontSizeSettings.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
}