import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'react-responsive-ui'
import { useDispatch } from 'react-redux'
import { getHttpClient } from 'react-pages'

import TextButton from '../TextButton.js'
import { Form, Field, Submit, FormComponent, FormAction, FormComponentAndButton } from '../Form.js'

import useUserData from '../../hooks/useUserData.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'
import useMultiDataSource from '../../hooks/useMultiDataSource.js'
import useMessages from '../../hooks/useMessages.js'

import { notify, showError } from '../../redux/notifications.js'

import _getChannels from '../../api/getChannels.js'
import _getThreads from '../../api/getThreads.js'

import {
	ContentSection,
	ContentSectionHeader,
	ContentSectionDescription
} from 'frontend-lib/components/ContentSection.js'

import isValidUrl from '../../utility/isValidUrl.js'

export default function ProxySettings({
	value,
	defaultValue,
	onChange
}) {
	const messages = useMessages()

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

	const dispatch = useDispatch()
	const userData = useUserData()
	const userSettings = useSettings()
	const dataSource = useDataSource()
	const multiDataSource = useMultiDataSource()
	const allMessages = useMessages()

	const testProxyServer = useCallback(async (proxyUrl) => {
		const { channels } = await _getChannels({
			// `proxyUrl: null` would force no use of proxy.
			proxyUrl: proxyUrl || null,
			// `Imageboard` parameters.
			http: getHttpClient(),
			userSettings,
			dataSource,
			multiDataSource,
			messages: allMessages
		})

		if (channels.length === 0) {
			return undefined
		}

		const threads = await _getThreads({
			channelId: channels[0].id,
			channelLayout: undefined,
			// `proxyUrl: null` would force no use of proxy.
			proxyUrl: proxyUrl || null,
			userData,
			// `Imageboard` parameters.
			http: getHttpClient(),
			userSettings,
			dataSource,
			messages: allMessages
		})

		if (threads.length === 0) {
			return undefined
		}

		return Boolean(threads[0].id)
	}, [
		dataSource,
		multiDataSource,
		userSettings,
		allMessages
	])

	const testProxyServerAndShowResult = useCallback(async (proxyUrl, { onSuccess }) => {
		const { testResults } = messages.settings.proxy
		try {
			const result = await testProxyServer(proxyUrl)
			if (result === true) {
				onSuccess()
			} else if (result === false) {
				dispatch(notify(testResults.error.replace('{error}', messages.error)))
			} else {
				dispatch(notify(testResults.undetermined))
			}
		} catch (error) {
			console.error(error)
			// Sometimes there's no `error.message` for some weird reason, just `error.status`.
			dispatch(showError(testResults.error.replace('{error}', error.message || error.status)))
		}
	}, [
		testProxyServer,
		messages
	])

	const onTestProxyServer = useCallback(async (proxyUrl) => {
		await testProxyServerAndShowResult(proxyUrl, {
			onSuccess: () => {
				const { testResults } = messages.settings.proxy
				dispatch(notify(testResults.ok))
			}
		})
	}, [
		testProxyServerAndShowResult
	])

	const onSave = useCallback(async ({ proxyUrl }) => {
		if (proxyUrl === defaultValue) {
			onChange()
		} else {
			onChange(proxyUrl)
		}
		dispatch(notify(messages.settings.proxy.saved))
	}, [
		testProxyServerAndShowResult,
		onChange
	])

	const savedValue = value || defaultValue

	const [useDefault, setUseDefault] = useState(!value)

	const testProxyServerButton = (
		<FormComponent type="button">
			<TextButton
				onClick={() => onTestProxyServer()}>
				{messages.settings.proxy.test}
			</TextButton>
		</FormComponent>
	)

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.proxy.title}
			</ContentSectionHeader>

			<ContentSectionDescription marginBottom="medium">
				{messages.settings.proxy.description}
			</ContentSectionDescription>

			<ContentSectionDescription marginBottom="medium">
				<a href="https://gitlab.com/catamphetamine/anychan/-/blob/master/docs/proxy/README.md" target="_blank">
					{messages.settings.proxy.setUpCustomProxyGuideTitle}
				</a>
			</ContentSectionDescription>

			<Switch
				value={useDefault}
				onChange={onUseDefault}
				placement="left">
				{messages.default}
			</Switch>

			{!useDefault &&
				<Form onSubmit={onSave}>
					{({ values }) => {
						const hasEditedProxyUrl = values && values.proxyUrl !== savedValue

						return (
							<>
								<FormComponentAndButton>
									<FormComponent>
										<Field
											required
											type="text"
											name="proxyUrl"
											placeholder={messages.settings.proxy.url}
											value={savedValue}
											validate={validateUrl}
										/>
									</FormComponent>
									{hasEditedProxyUrl &&
										<FormAction inline>
											<Submit
												type="submit"
												customHeight
												component={TextButton}>
												{messages.actions.save}
											</Submit>
										</FormAction>
									}
								</FormComponentAndButton>

								{/* Proxy Server Test button */}
								{!hasEditedProxyUrl &&
									testProxyServerButton
								}
							</>
						)
					}}
				</Form>
			}

			{/* Proxy Server Test button */}
			{useDefault &&
				testProxyServerButton
			}
		</ContentSection>
	)
}

ProxySettings.propTypes = {
	value: PropTypes.string,
	defaultValue: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
}