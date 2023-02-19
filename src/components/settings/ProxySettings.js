import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'react-responsive-ui'
import { useDispatch } from 'react-redux'
import { getHttpClient } from 'react-pages'

import TextButton from '../TextButton.js'
import { Form, Field, Submit } from '../Form.js'

import useUserData from '../../hooks/useUserData.js'
import useSettings from '../../hooks/useSettings.js'

import { notify, showError } from '../../redux/notifications.js'

import _getChannels from '../../api/getChannels.js'
import _getThreads from '../../api/getThreads.js'

import {
	ContentSection,
	ContentSectionHeader,
	ContentSectionDescription
} from 'frontend-lib/components/ContentSection.js'

import isValidUrl from '../../utility/isValidUrl.js'

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
		dispatch(notify(messages.settings.proxy.saved))
	}, [onChange])

	const dispatch = useDispatch()
	const userData = useUserData()
	const userSettings = useSettings()

	const onTestProxyServer = useCallback(async (proxyUrl) => {
		const getProxyTestResult = async () => {
			const { channels } = await _getChannels({
				http: getHttpClient(),
				proxyUrl,
				userSettings
			})

			if (channels.length === 0) {
				return undefined
			}

			const threads = await _getThreads({
				channelId: channels[0].id,
				http: getHttpClient(),
				proxyUrl,
				userData,
				userSettings
			})

			if (threads.length === 0) {
				return undefined
			}

			return Boolean(threads[0].id)
		}

		const { testResults } = messages.settings.proxy

		try {
			const result = await getProxyTestResult()
			dispatch(notify(
				result === true
					? testResults.ok
					: (
						result === false
							? testResults.error.replace('{error}', messages.error)
							: testResults.undetermined
					)
			))
		} catch (error) {
			console.error(error)
			// Sometimes there's no `error.message` for some weird reason, just `error.status`.
			dispatch(showError(testResults.error.replace('{error}', error.message || error.status)))
		}
	}, [])

	const savedValue = value || defaultValue

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
					{({ values }) => (
						<>
							<div className="form__component-and-button">
								<Field
									required
									type="text"
									name="proxyUrl"
									label={messages.settings.proxy.url}
									value={savedValue}
									validate={validateUrl}
									className="form__component"
								/>
								{values && values.proxyUrl !== savedValue &&
									<Submit
										type="submit"
										component={TextButton}
										className="form__action form__action--inline">
										{messages.actions.save}
									</Submit>
								}
							</div>

							{/* Proxy Server Test button */}
							<div className="form__component form__component--button">
								<TextButton
									onClick={() => onTestProxyServer(values && values.proxyUrl)}>
									{messages.settings.proxy.test}
								</TextButton>
							</div>
						</>
					)}
				</Form>
			}

			{/* Proxy Server Test button */}
			{useDefault &&
				<div className="form__component form__component--button">
					<TextButton
						onClick={() => onTestProxyServer()}>
						{messages.settings.proxy.test}
					</TextButton>
				</div>
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