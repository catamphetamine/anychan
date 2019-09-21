import React from 'react'
import PropTypes from 'prop-types'
import { Button, TextInput, FileUploadButton } from 'react-responsive-ui'

import saveFile from 'webapp-frontend/src/utility/saveFile'
import readTextFile from 'webapp-frontend/src/utility/readTextFile'
import { clearCache as clearYouTubeCache } from 'webapp-frontend/src/utility/video-youtube-cache'
import OkCancelDialog from 'webapp-frontend/src/components/OkCancelDialog'
import { okCancelDialog } from 'webapp-frontend/src/redux/okCancelDialog'
import { notify } from 'webapp-frontend/src/redux/notifications'

import { Form, Field, Submit } from 'webapp-frontend/src/components/Form'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import {
	resetSettings,
	replaceSettings
} from '../../redux/app'

import Settings from '../../utility/settings'
import UserData from '../../UserData/UserData'
import onUserDataChange from '../../UserData/onUserDataChange'

export default function DataSettings({
	messages,
	dispatch
}) {
	async function onResetSettings() {
		dispatch(okCancelDialog(messages.settings.data.resetSettings.warning))
		if (await OkCancelDialog.getPromise()) {
			// Reset settings.
			dispatch(resetSettings())
			Settings.apply({ dispatch })
			// Done.
			dispatch(notify(messages.settings.data.resetSettings.done))
		}
	}

	async function onClearUserData() {
		dispatch(okCancelDialog(messages.settings.data.clearUserData.warning))
		if (await OkCancelDialog.getPromise()) {
			// Reset user data.
			// Could also be implented as `resetUserData()`
			// similar to `resetSettings()`.
			UserData.clear()
			// Update tracked threads list in the UI.
			onUserDataChange(null, dispatch)
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
			return dispatch(notify(messages.settings.data.import.error, { type: 'error' }))
		}
		const { settings, userData } = json
		// Add user data.
		// Could also be implented as `mergeUserData()`
		// similar to `replaceSettings()`.
		UserData.merge(userData)
		// Update tracked threads list in the UI.
		onUserDataChange(null, dispatch)
		// Done.
		dispatch(notify(messages.settings.data.merge.done))
	}

	async function onImport(file) {
		const text = await readTextFile(file)
		let json
		try {
			json = JSON.parse(text)
		} catch (error) {
			return dispatch(notify(messages.settings.data.import.error, { type: 'error' }))
		}
		const { settings, userData } = json
		dispatch(okCancelDialog(messages.settings.data.import.warning))
		if (await OkCancelDialog.getPromise()) {
			// Replace settings.
			dispatch(replaceSettings(settings))
			Settings.apply({ dispatch })
			// Replace user data.
			// Could also be implented as `replaceUserData()`
			// similar to `replaceSettings()`.
			UserData.replace(userData)
			// Update tracked threads list in the UI.
			onUserDataChange(null, dispatch)
			// Done.
			dispatch(notify(messages.settings.data.import.done))
		}
	}

	function onExport() {
		saveFile(
			JSON.stringify({
				settings: Settings.getCustomSettings(),
				userData: UserData.get()
			}, null, 2),
			'captchan-settings.json'
		)
	}

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.data.title}
			</ContentSectionHeader>
			<p className="content-section__description">
				{messages.settings.data.description}
			</p>
			<div className="form">
				<div className="form__component form__component--button">
					<Button
						onClick={onResetSettings}
						className="rrui__button--text">
						{messages.settings.data.resetSettings.title}
					</Button>
				</div>
				<div className="form__component form__component--button">
					<Button
						onClick={onClearUserData}
						className="rrui__button--text">
						{messages.settings.data.clearUserData.title}
					</Button>
				</div>
				<div className="form__component form__component--button">
					<Button
						onClick={clearYouTubeCache}
						className="rrui__button--text">
						{messages.settings.data.clearYouTubeCache.title}
					</Button>
				</div>
				<br/>
				<div className="form__component form__component--button">
					<Button
						onClick={onExport}
						className="rrui__button--text rrui__button--multiline">
						{messages.settings.data.export.title}
					</Button>
				</div>
				<div className="form__component form__component--button">
					<FileUploadButton
						accept=".json"
						component={Button}
						onChange={onImport}
						className="rrui__button--text rrui__button--multiline">
						{messages.settings.data.import.title}
					</FileUploadButton>
				</div>
				<br/>
				<div className="form__component form__component--button">
					<FileUploadButton
						accept=".json"
						component={Button}
						onChange={onAddUserData}
						className="rrui__button--text rrui__button--multiline">
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
	dispatch: PropTypes.func.isRequired
}