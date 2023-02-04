import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, TextInput } from 'react-responsive-ui'

import Select from '../Select.js'
import TextButton from '../TextButton.js'
import FillButton from '../FillButton.js'
import { Form, Field, Submit } from '../Form.js'
import OkCancelModal from 'frontend-lib/components/OkCancelModal.js'

import { isValidUrl, isValidRelativeUrl } from 'social-components/utility/url.js'

import { saveTheme } from '../../redux/settings.js'

import {
	getThemes,
	isBuiltInTheme,
	addTheme,
	removeTheme,
	applyTheme
} from '../../utility/themes.js'

import {
	getDefaultThemeId
} from '../../utility/settings/settingsDefaults.js'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import { showError } from '../../redux/notifications.js'

const CSS_URL_REGEXP = /\.css(\?.*)?$/

export default function ThemeSettings({
	messages,
	settings,
	dispatch,
	guideUrl
}) {
	const [theme, setTheme] = useState(settings.theme)
	const [showAddThemeModal, setShowAddThemeModal] = useState()

	async function onSelectTheme(id) {
		setTheme(id)
		try {
			await applyTheme(id)
		} catch (error) {
			if (error.message === 'STYLESHEET_ERROR') {
				dispatch(showError(messages.settings.theme.add.cssFileError))
			} else {
				dispatch(showError(messages.error))
			}
			throw error
		}
		dispatch(saveTheme(id))
	}

	async function onAddTheme(id) {
		try {
			await applyTheme(id)
		} catch (error) {
			removeTheme(id)
			throw error
		}
		dispatch(saveTheme(id))
		setTheme(id)
	}

	async function onRemoveSelectedTheme() {
		if (await OkCancelModal.show(messages.settings.theme.deleteCurrent.warning.replace('{0}', theme))) {
			removeTheme(theme)
			await onSelectTheme(getDefaultThemeId())
		}
	}

	const options = getThemes().map((theme) => ({
		value: theme.id,
		label: messages.settings.theme.themes[theme.id] || theme.name || theme.id
	}))

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.theme.title}
			</ContentSectionHeader>

			<div className="form">
				<Select
					value={theme}
					options={options}
					onChange={onSelectTheme}
					className="form__component"
				/>
				<div className="form__component form__component--button">
					<TextButton
						onClick={() => setShowAddThemeModal(true)}>
						{messages.settings.theme.add.title}
					</TextButton>
				</div>
				{guideUrl &&
					<div className="form__component form__component--button">
						<a
							href={guideUrl}
							target="_blank">
							{messages.settings.theme.guide}
						</a>
					</div>
				}
				{!isBuiltInTheme(theme) &&
					<div className="form__component form__component--button">
						<TextButton
							onClick={onRemoveSelectedTheme}>
							{messages.settings.theme.deleteCurrent.title}
						</TextButton>
					</div>
				}
			</div>

			{/* Add theme modal */}
			<Modal
				isOpen={showAddThemeModal}
				close={() => setShowAddThemeModal(false)}>
				<Modal.Title>
					{messages.settings.theme.add.title}
				</Modal.Title>
				<Modal.Content>
					<AddTheme
						messages={messages}
						onSaveTheme={onAddTheme}
						close={() => setShowAddThemeModal(false)}/>
				</Modal.Content>
			</Modal>
		</ContentSection>
	)
}

ThemeSettings.propTypes = {
	messages: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	guideUrl: PropTypes.string
}

const THEME_ID_REG_EXP = /^[a-zA-Z-_\d]+$/

function AddTheme({
	messages,
	onSaveTheme,
	close
}) {
	const addThemeForm = useRef()
	const [pasteCodeInstead, setPasteCodeInstead] = useState()

	// Focus the "Code" input after "Paste CSS code instead" has been clicked.
	useEffect(() => {
		if (pasteCodeInstead) {
			addThemeForm.current.focus('css')
		}
	}, [pasteCodeInstead])

	function validateCssUrl(value) {
		if (!isValidUrl(value) && !isValidRelativeUrl(value)) {
			return messages.settings.theme.add.invalidUrl
		}
		if (!CSS_URL_REGEXP.test(value)) {
			return messages.settings.theme.add.invalidExtension
		}
	}

	function validateId(value) {
		if (!THEME_ID_REG_EXP.test(value)) {
			return messages.settings.theme.add.invalidId
		}
		for (const theme of getThemes()) {
			if (value === theme.id) {
				return messages.settings.theme.add.alreadyExists
			}
		}
	}

	function validateName(value) {
		for (const theme of getThemes()) {
			if (value === theme.name) {
				return messages.settings.theme.add.alreadyExists
			}
		}
	}

	async function onAddTheme(theme) {
		try {
			if (theme.css) {
				delete theme.url
			}
			addTheme(theme)
			await onSaveTheme(theme.id, getThemes().concat(theme))
			close()
		} catch (error) {
			console.error(error)
			if (error.message === 'STYLESHEET_ERROR') {
				throw new Error(messages.settings.theme.add.cssFileError)
			}
			throw error
		}
	}

	return (
		<Form
			autoFocus
			ref={addThemeForm}
			requiredMessage={messages.form.error.required}
			onSubmit={onAddTheme}
			className="form">
			<Field
				required
				name="id"
				label={messages.settings.theme.add.id}
				component={TextInput}
				validate={validateId}
				className="form__component"/>
			<Field
				required
				name="name"
				label={messages.settings.theme.add.name}
				component={TextInput}
				validate={validateName}
				className="form__component"/>
			{!pasteCodeInstead &&
				<Field
					required
					name="url"
					label={messages.settings.theme.add.url}
					validate={validateCssUrl}
					component={TextInput}
					className="form__component"/>
			}
			{!pasteCodeInstead &&
				<TextButton
					onClick={() => setPasteCodeInstead(true)}
					className="form__component">
					{messages.settings.theme.add.pasteCodeInstead}
				</TextButton>
			}
			{pasteCodeInstead &&
				<Field
					required
					multiline
					name="css"
					label={messages.settings.theme.add.code}
					component={TextInput}
					className="form__component rrui__input--monospace"/>
			}
			<div className="form__actions">
				<TextButton
					onClick={close}
					className="form__action">
					{messages.actions.cancel}
				</TextButton>
				<Submit
					component={FillButton}
					className="form__action">
					{messages.actions.add}
				</Submit>
			</div>
		</Form>
	)
}

AddTheme.propTypes = {
	messages: PropTypes.object.isRequired,
	onSaveTheme: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired
}