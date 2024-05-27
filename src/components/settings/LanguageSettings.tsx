import type { ReactNode } from 'react'
import type { Locale } from '@/types'

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Select from '../Select.js'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import useMessages from '../../hooks/useMessages.js'

export default function LanguageSettings({
	value,
	onChange,
	languages,
	children
}: LanguageSettingsProps) {
	const messages = useMessages()

	const options = useMemo(() => {
		return (Object.keys(languages) as Array<keyof typeof languages>).map((language) => ({
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
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	languages: PropTypes.objectOf(PropTypes.string).isRequired,
	children: PropTypes.node
}

interface LanguageSettingsProps {
	value: Locale,
	onChange: (language: Locale) => void,
	languages: Record<Locale, string>,
	children?: ReactNode
}