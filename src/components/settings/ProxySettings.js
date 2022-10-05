import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Switch, TextInput } from 'react-responsive-ui'

import TextButton from '../TextButton.js'
import { Form, Field, Submit } from '../Form.js'

import {
	ContentSection,
	ContentSectionHeader,
	ContentSectionDescription
} from 'frontend-lib/components/ContentSection.js'

import { isValidUrl } from 'social-components/utility/url.js'

const CSS_URL_REGEXP = /\.css(\?.*)?$/

export default function ProxySettings({
	messages,
	value,
	defaultValue,
	onChange
}) {
	const validateUrl = useCallback((value) => {
		if (!isValidUrl(value)) {
			return messages.settings.proxy.invalidUrl
		}
	}, [messages])
	const onUseDefault = useCallback((value) => {
		setUseDefault(value)
		if (value) {
			onChange()
		}
	}, [])
	const onSave = useCallback(({ proxyUrl }) => {
		if (proxyUrl === defaultValue) {
			onChange()
		} else {
			onChange(proxyUrl)
		}
	}, [onChange])
	const [useDefault, setUseDefault] = useState(!value)
	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.proxy.title}
			</ContentSectionHeader>

			<ContentSectionDescription marginBottom="medium">
				{messages.settings.proxy.description}
			</ContentSectionDescription>

			<Switch
				value={useDefault}
				onChange={onUseDefault}
				placement="left">
				{messages.default}
			</Switch>

			{!useDefault &&
				<Form
					onSubmit={onSave}
					requiredMessage={messages.form.error.required}
					className="form">
					<div className="form__component-and-button">
						<Field
							required
							name="proxyUrl"
							label={messages.settings.proxy.url}
							component={TextInput}
							value={value || defaultValue}
							validate={validateUrl}
							className="form__component"/>
						<Submit
							type="submit"
							component={TextButton}
							className="form__action">
							{messages.actions.save}
						</Submit>
					</div>
				</Form>
			}
		</ContentSection>
	)
}

ProxySettings.propTypes = {
	messages: PropTypes.object.isRequired,
	value: PropTypes.string,
	defaultValue: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
}