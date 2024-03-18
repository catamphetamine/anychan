import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { FileUploadButton } from 'react-responsive-ui'
import { filesize } from 'filesize'
import { useDispatch } from 'react-redux'

import saveFile from 'frontend-lib/utility/saveFile.js'
import readTextFile from 'frontend-lib/utility/readTextFile.js'
import resourceCache from '../../utility/resourceCache.js'
import sortSubscribedThreads from '../../utility/subscribedThread/sortSubscribedThreads.js'
import { clearChannelsCache } from '../../api/cached/getChannels.js'
import OkCancelModal from 'frontend-lib/components/OkCancelModal.js'
import { notify, showError } from '../../redux/notifications.js'

import { FormStyle, FormComponent } from '../Form.js'
import TextButton from '../TextButton.js'

import {
	ContentSection,
	ContentSectionHeader,
	ContentSectionDescription
} from 'frontend-lib/components/ContentSection.js'

import {
	resetSettings,
	replaceSettings
} from '../../redux/settings.js'

import applySettings from '../../utility/settings/applySettings.js'

import useMultiDataSource from '../../hooks/useMultiDataSource.js'
import useDataSource from '../../hooks/useDataSource.js'
import useSettings from '../../hooks/useSettings.js'
import useUserData from '../../hooks/useUserData.js'

export default function DataSettings({
	messages
}) {
	const multiDataSource = useMultiDataSource()
	const dataSource = useDataSource()
	const userData = useUserData()
	const userSettings = useSettings()

	const dispatch = useDispatch()

	const [userDataSize, setUserDataSize] = useState()

	const onShowUserDataSize = useCallback(() => {
		setUserDataSize(userData.getSize())
	}, [])

	async function onResetSettings() {
		if (await OkCancelModal.show({
			text: messages.settings.data.resetSettings.warning
		})) {
			// Reset settings.
			dispatch(resetSettings({ userSettings }))
			applySettings({ dispatch, userSettings })
			// Done.
			dispatch(notify(messages.settings.data.resetSettings.done))
		}
	}

	async function onClearUserData() {
		if (await OkCancelModal.show({
			text: messages.settings.data.clearUserData.warning
		})) {
			// Reset user data.
			// Could also be implented as `resetUserData()`
			// similar to `resetSettings()`.
			userData.clear()
			// Done.
			dispatch(notify(messages.settings.data.clearUserData.done))
		}
	}

	async function onAddUserData(file) {
		const text = await readTextFile(file)
		let json
		try {
			json = JSON.parse(text)
		} catch (error) {
			return dispatch(showError(messages.settings.data.import.error))
		}
		const { settings, userData: userDataData } = json
		// Add user data.
		// Could also be implented as `mergeUserData()`
		// similar to `replaceSettings()`.
		userData.merge(userDataData)
		// Sort subscribed threads.
		// Doesn't update the subscribed threads "index" collection,
		// but that collection is not required to be updated here
		// because the list of subscribed threads doesn't change here:
		// only the order of the subscribed threads does.
		userData.setSubscribedThreads(
			sortSubscribedThreads(userData.getSubscribedThreads(), { userData })
		)
		// Done.
		dispatch(notify(messages.settings.data.merge.done))
	}

	async function onImport(file) {
		const text = await readTextFile(file)
		let json
		try {
			json = JSON.parse(text)
		} catch (error) {
			return dispatch(showError(messages.settings.data.import.error))
		}
		const { settings, userData: userDataData } = json
		if (await OkCancelModal.show({
			text: messages.settings.data.import.warning
		})) {
			// Replace settings.
			dispatch(replaceSettings({ settings, userSettings }))
			applySettings({ dispatch, userSettings })
			// Replace user data.
			// Could also be implented as `replaceUserData()`
			// similar to `replaceSettings()`.
			userData.replace(userDataData)
			// Done.
			dispatch(notify(messages.settings.data.import.done))
		}
	}

	function onExport() {
		saveFile(
			JSON.stringify({
				settings: userSettings.get(),
				userData: userData.get()
			}, null, 2),
			'anychan-settings.json'
		)
	}

	function onClearChannelsCache() {
		clearChannelsCache({
			dataSource,
			multiDataSource
		})
		dispatch(notify(messages.status.done))
	}

	function onClearYouTubeCache() {
		resourceCache.clear('youtube')
		dispatch(notify(messages.status.done))
	}

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.data.title}
			</ContentSectionHeader>
			<ContentSectionDescription marginBottom="large">
				{messages.settings.data.description}
			</ContentSectionDescription>
			{userDataSize === undefined
				? (
					<>
						<TextButton
							onClick={onShowUserDataSize}>
							{messages.settings.data.showUserDataSize}
						</TextButton>
						<br/>
					</>
				)
				: (
					<>
						{messages.settings.data.userDataSize}
						{' — '}
						<code>
							{filesize(userDataSize)}
						</code>
						<br/>
						<br/>
					</>
				)
			}
			<FormStyle>
				<FormComponent type="button">
					<TextButton
						onClick={onResetSettings}>
						{messages.settings.data.resetSettings.title}
					</TextButton>
				</FormComponent>
				<FormComponent type="button">
					<TextButton
						onClick={onClearUserData}>
						{messages.settings.data.clearUserData.title}
					</TextButton>
				</FormComponent>
				<FormComponent type="button">
					<TextButton
						onClick={onClearChannelsCache}>
						{messages.settings.data.clearChannelsCache.title}
					</TextButton>
				</FormComponent>
				<FormComponent type="button">
					<TextButton
						onClick={onClearYouTubeCache}>
						{messages.settings.data.clearYouTubeCache.title}
					</TextButton>
				</FormComponent>
				<br/>
				<FormComponent type="button">
					<TextButton
						multiline
						onClick={onExport}>
						{messages.settings.data.export.title}
					</TextButton>
				</FormComponent>
				<FormComponent type="button">
					<FileUploadButton
						accept=".json"
						multiline
						component={TextButton}
						onChange={onImport}>
						{messages.settings.data.import.title}
					</FileUploadButton>
				</FormComponent>
				<br/>
				<FormComponent type="button">
					<FileUploadButton
						accept=".json"
						multiline
						component={TextButton}
						onChange={onAddUserData}>
						{messages.settings.data.merge.title}
					</FileUploadButton>
				</FormComponent>
				<FormComponent type="description">
					{messages.settings.data.merge.description}
				</FormComponent>
			</FormStyle>
		</ContentSection>
	)
}

DataSettings.propTypes = {
	messages: PropTypes.object.isRequired
}