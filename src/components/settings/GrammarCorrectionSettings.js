import React from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'react-responsive-ui'

import {
	ContentSection,
	ContentSectionHeader,
	ContentSectionDescription
} from 'frontend-lib/components/ContentSection.js'

import useMessages from '../../hooks/useMessages.js'

export default function GrammarCorrectionSettings({
	value,
	onChange
}) {
	const messages = useMessages()

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.grammarCorrection.title}
			</ContentSectionHeader>

			<Switch
				value={value}
				onChange={onChange}
				placement="left">
				{messages.settings.grammarCorrection.enable}
			</Switch>

			<ContentSectionDescription marginTop="medium">
				{messages.settings.grammarCorrection.description}
				{' '}
				<a target="_blank" href="https://gitlab.com/catamphetamine/anychan/-/blob/master/src/api/utility/correctGrammar.js">
					{messages.settings.grammarCorrection.viewCode}
				</a>.
			</ContentSectionDescription>
		</ContentSection>
	)
}

GrammarCorrectionSettings.propTypes = {
	value: PropTypes.bool,
	onChange: PropTypes.func.isRequired
}