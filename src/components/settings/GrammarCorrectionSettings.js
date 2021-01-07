import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'react-responsive-ui'

import {
	ContentSection,
	ContentSectionHeader,
	ContentSectionDescription
} from 'webapp-frontend/src/components/ContentSection'

export default function GrammarCorrectionSettings({
	messages,
	value,
	onChange
}) {
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
				<a target="_blank" href="https://gitlab.com/catamphetamine/captchan/-/blob/master/src/api/utility/correctGrammar.js">
					{messages.settings.grammarCorrection.viewCode}
				</a>.
			</ContentSectionDescription>
		</ContentSection>
	)
}

GrammarCorrectionSettings.propTypes = {
	messages: PropTypes.object.isRequired,
	value: PropTypes.bool,
	onChange: PropTypes.func.isRequired
}