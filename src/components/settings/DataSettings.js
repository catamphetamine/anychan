import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { TextInput, FileUploadButton } from 'react-responsive-ui'
import filesize from 'filesize'

import saveFile from 'frontend-lib/utility/saveFile.js'
import readTextFile from 'frontend-lib/utility/readTextFile.js'
import resourceCache from '../../utility/resourceCache.js'
import { clearChannelsCache } from '../../api/cached/getChannels.js'
import OkCancelModal from 'frontend-lib/components/OkCancelModal.js'
import { notify, showError } from '../../redux/notifications.js'

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
import getUserSettings from '../../UserSettings.js'
import getUserData from '../../UserData.js'

export default function DataSettings({
	messages,
	locale,
	dispatch,
	userData = getUserData(),
	userSettings = getUserSettings()
}) {
	const [userDataSize, setUserDataSize] = useState()

	const onShowUserDataSize = useCallback(() => {
		setUserDataSize(userData.getSize())
	}, [])

	async function onResetSettings() {
		if (await OkCancelModal.show(messages.settings.data.resetSettings.warning)) {
			// Reset settings.
			dispatch(resetSettings())
			applySettings({ dispatch })
			// Done.
			dispatch(notify(messages.settings.data.resetSettings.done))
		}
	}

	async function onClearUserData() {
		if (await OkCancelModal.show(messages.settings.data.clearUserData.warning)) {
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
		const { settings, userData } = json
		// Add user data.
		// Could also be implented as `mergeUserData()`
		// similar to `replaceSettings()`.
		userData.merge(userData)
		// Sort subscribed threads.
		// Doesn't update the subscribed threads "index" collection,
		// but that collection is not required to be updated here
		// because the list of subscribed threads doesn't change here:
		// only the order of the subscribed threads does.
		userData.setSubscribedThreads(
			sortSubscribedThreads(userData.getSubscribedThreads())
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
		const { settings, userData } = json
		if (await OkCancelModal.show(messages.settings.data.import.warning)) {
			// Replace settings.
			dispatch(replaceSettings(settings))
			applySettings({ dispatch })
			// Replace user data.
			// Could also be implented as `replaceUserData()`
			// similar to `replaceSettings()`.
			userData.replace(userData)
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
		clearChannelsCache()
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
					<TextButton
						onClick={onShowUserDataSize}>
						{messages.settings.data.showUserDataSize}
					</TextButton>
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
			<div className="form">
				<div className="form__component form__component--button">
					<TextButton
						onClick={onResetSettings}>
						{messages.settings.data.resetSettings.title}
					</TextButton>
				</div>
				<div className="form__component form__component--button">
					<TextButton
						onClick={onClearUserData}>
						{messages.settings.data.clearUserData.title}
					</TextButton>
				</div>
				<div className="form__component form__component--button">
					<TextButton
						onClick={onClearChannelsCache}>
						{messages.settings.data.clearChannelsCache.title}
					</TextButton>
				</div>
				<div className="form__component form__component--button">
					<TextButton
						onClick={onClearYouTubeCache}>
						{messages.settings.data.clearYouTubeCache.title}
					</TextButton>
				</div>
				<br/>
				<div className="form__component form__component--button">
					<TextButton
						multiline
						onClick={onExport}>
						{messages.settings.data.export.title}
					</TextButton>
				</div>
				<div className="form__component form__component--button">
					<FileUploadButton
						accept=".json"
						multiline
						component={TextButton}
						onChange={onImport}>
						{messages.settings.data.import.title}
					</FileUploadButton>
				</div>
				<br/>
				<div className="form__component form__component--button">
					<FileUploadButton
						accept=".json"
						multiline
						component={TextButton}
						onChange={onAddUserData}>
						{messages.settings.data.merge.title}
					</FileUploadButton>
				</div>
				<p className="form__component form__component--description">
					{messages.settings.data.merge.description}
				</p>
			</div>
		</ContentSection>
	)
}

DataSettings.propTypes = {
	messages: PropTypes.object.isRequired,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired
}