import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Select from '../Select.js'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

export default function LanguageSettings({
	messages,
	value,
	onChange,
	languages,
	children
}) {
	const options = useMemo(() => {
		return Object.keys(languages).map((language) => ({
			value: language,
			label: languages[language]
		}))
	}, [languages])

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.language.title}
			</ContentSectionHeader>
			<Select
				value={value}
				options={options}
				onChange={onChange}
			/>
			{children}
		</ContentSection>
	)
}

LanguageSettings.propTypes = {
	messages: PropTypes.object.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	languages: PropTypes.objectOf(PropTypes.string).isRequired,
	children: PropTypes.node
}