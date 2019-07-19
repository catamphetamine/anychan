import React from 'react'
import PropTypes from 'prop-types'
import { Button, TextInput, FileUploadButton } from 'react-responsive-ui'

import saveFile from 'webapp-frontend/src/utility/saveFile'
import readTextFile from 'webapp-frontend/src/utility/readTextFile'
import { clearCache as clearYouTubeCache } from 'webapp-frontend/src/utility/video-youtube-cache'
import OkCancelDialog from 'webapp-frontend/src/components/OkCancelDialog'

import { Form, Field, Submit } from 'webapp-frontend/src/components/Form'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import Settings from '../../utility/settings'
import UserData from '../../UserData/UserData'

export default function DataSettings({
	messages,
	onResetSettings,
	onReplaceSettings,
	okCancelDialog,
	notify
}) {
	async function _onResetSettings() {
		okCancelDialog(messages.settings.data.resetSettings.warning)
		if (await OkCancelDialog.getPromise()) {
			onResetSettings()
			Settings.apply()
			notify(messages.settings.data.resetSettings.done)
		}
	}

	async function onClearUserData() {
		okCancelDialog(messages.settings.data.clearUserData.warning)
		if (await OkCancelDialog.getPromise()) {
			UserData.clear()
			notify(messages.settings.data.clearUserData.done)
		}
	}

	async function onAddUserData(file) {
		const text = await readTextFile(file)
		let json
		try {
			json = JSON.parse(text)
		} catch (error) {
			return notify(messages.settings.data.import.error, { type: 'error' })
		}
		const { settings, userData } = json
		UserData.merge(userData)
		notify(messages.settings.data.merge.done)
	}

	async function onImport(file) {
		const text = await readTextFile(file)
		let json
		try {
			json = JSON.parse(text)
		} catch (error) {
			return notify(messages.settings.data.import.error, { type: 'error' })
		}
		const { settings, userData } = json
		okCancelDialog(messages.settings.data.import.warning)
		if (await OkCancelDialog.getPromise()) {
			onReplaceSettings(settings)
			UserData.replace(userData)
			Settings.apply()
			notify(messages.settings.data.import.done)
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
						onClick={_onResetSettings}
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
	onResetSettings: PropTypes.func.isRequired,
	onReplaceSettings: PropTypes.func.isRequired,
	okCancelDialog: PropTypes.func.isRequired,
	notify: PropTypes.func.isRequired
}