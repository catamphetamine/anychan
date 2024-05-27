import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error
import { Switch } from 'react-responsive-ui'

import { Form, Field, Submit, FormComponent, FormAction, FormComponentAndButton } from '../Form.js'

import { useDispatch } from 'react-redux'

import TextButton from '../TextButton.js'

import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'
import useMultiDataSource from '../../hooks/useMultiDataSource.js'
import useMessages from '../../hooks/useMessages.js'

import { notify, showError } from '../../redux/notifications.js'

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
}: PropTypes.InferProps<typeof ProxySettings.propTypes>) {
	const messages = useMessages()

	const [useDefault, setUseDefault] = useState(!value)

	const validateUrl = useCallback((value: string) => {
		if (!isValidUrl(value)) {
			return messages.settings.proxy.invalidUrl
		}
	}, [messages])

	const onUseDefault = useCallback((value: boolean) => {
		setUseDefault(value)
		if (value) {
			onChange()
		}
	}, [])

	const dispatch = useDispatch()
	const userSettings = useSettings()
	const dataSource = useDataSource()
	const multiDataSource = useMultiDataSource()
	const allMessages = useMessages()

	const testProxyServer = useCallback(async (proxyUrl: string) => {
		const { channels } = await dataSource.api.getChannels({
			// `proxyUrl: null` would force no use of proxy.
			proxyUrl: proxyUrl || null,
			originalDomain: undefined,
			locale: 'en'
		})

		if (channels.length === 0) {
			return undefined
		}

		const { threads } = await dataSource.api.getThreads({
			// `proxyUrl: null` would force no use of proxy.
			proxyUrl: proxyUrl || null,
			originalDomain: undefined,
			channelId: channels[0].id,
			dataSourceId: dataSource.id,
			channelLayout: 'threadsList',
			locale: 'en'
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

	const testProxyServerAndShowResult = useCallback(async (proxyUrl: string, { onSuccess }: { onSuccess: () => void }) => {
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

	const onTestProxyServer = useCallback(async (proxyUrl: string) => {
		await testProxyServerAndShowResult(proxyUrl, {
			onSuccess: () => {
				const { testResults } = messages.settings.proxy
				dispatch(notify(testResults.ok))
			}
		})
	}, [
		testProxyServerAndShowResult
	])

	const onTestCurrentProxyServer = useCallback(async () => {
		return await onTestProxyServer(value)
	}, [
		onTestProxyServer,
		value
	])

	const onSave = useCallback(async ({ proxyUrl }: { proxyUrl?: string }) => {
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

	const testProxyServerButton = (
		<FormComponent type="button">
			<TextButton
				onClick={() => onTestCurrentProxyServer()}>
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
					{({ values }: { values: FormValues }) => {
						const hasEditedProxyUrl = values && values.proxyUrl !== value

						return (
							<>
								<FormComponentAndButton>
									<FormComponent>
										<Field
											required
											type="text"
											name="proxyUrl"
											placeholder={messages.settings.proxy.url}
											value={value}
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

interface FormValues {
	proxyUrl: string
}