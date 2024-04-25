import React, { useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal } from 'react-responsive-ui'

import Select from '../Select.js'
import TextButton from '../TextButton.js'
import FillButton from '../FillButton.js'
import { Form, Field, Submit, FormStyle, FormComponent, FormActions, FormAction } from '../Form.js'
import OkCancelModal from 'frontend-lib/components/OkCancelModal.js'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import isValidUrl from '../../utility/isValidUrl.js'
import isValidRelativeUrl from '../../utility/isValidRelativeUrl.js'

import { saveTheme } from '../../redux/settings.js'

import {
	getTheme,
	getThemes,
	isBuiltInTheme,
	addOrUpdateTheme,
	removeTheme,
	applyTheme
} from '../../utility/themes.ts'

import {
	getDefaultThemeId
} from '../../utility/settings/settingsDefaults.ts'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import { showError } from '../../redux/notifications.js'

import useSettings from '../../hooks/useSettings.js'
import useMessages from '../../hooks/useMessages.js'

const CSS_URL_REGEXP = /\.css(\?.*)?$/

export default function ThemeSettings({
	settings,
	guideUrl
}) {
	const userSettings = useSettings()
	const messages = useMessages()

	const dispatch = useDispatch()

	const currentThemeId = settings.theme

	// Added a "dummy" state variable in order to re-trigger `useMemo()` below
	// when a user saves some changes to current background.
	const [currentThemeUpdateFlag, setCurrentThemeUpdateFlag] = useState()

	const currentTheme = useMemo(() => {
		return getTheme(currentThemeId, { userSettings })
	}, [currentThemeId, currentThemeUpdateFlag, userSettings])

	const [showAddThemeModal, setShowAddThemeModal] = useState()

	async function onSelectTheme(id) {
		try {
			await applyTheme(id, { userSettings })
		} catch (error) {
			if (error.message === 'STYLESHEET_ERROR') {
				dispatch(showError(messages.settings.theme.add.cssFileError))
			} else {
				dispatch(showError(messages.error))
			}
			throw error
		}
		dispatch(saveTheme({ theme: id, userSettings }))
	}

	async function onAddTheme(id) {
		try {
			await applyTheme(id, { userSettings })
		} catch (error) {
			removeTheme(id, { userSettings })
			throw error
		}
		dispatch(saveTheme({ theme: id, userSettings }))
	}

	async function onRemoveSelectedTheme() {
		if (await OkCancelModal.show({
			text: messages.settings.theme.deleteCurrent.warning.replace('{theme}', currentThemeId)
		})) {
			removeTheme(currentThemeId, { userSettings })
			await onSelectTheme(getDefaultThemeId())
		}
	}

	const options = getThemes({ userSettings }).map((theme) => ({
		value: theme.id,
		label: messages.settings.theme.themes[theme.id] || theme.name || theme.id
	}))

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.theme.title}
			</ContentSectionHeader>

			<FormStyle>
				<FormComponent>
					<Select
						value={currentThemeId}
						options={options}
						onChange={onSelectTheme}
					/>
				</FormComponent>
				<FormComponent type="button">
					<TextButton
						onClick={() => setShowAddThemeModal(true)}>
						{messages.settings.theme.add.title}
					</TextButton>
				</FormComponent>
				{guideUrl &&
					<FormComponent type="button">
						<a
							href={guideUrl}
							target="_blank">
							{messages.settings.theme.guide}
						</a>
					</FormComponent>
				}
				{!isBuiltInTheme(currentThemeId) &&
					<FormComponent type="button">
						<TextButton
							onClick={onRemoveSelectedTheme}>
							{messages.settings.theme.deleteCurrent.title}
						</TextButton>
					</FormComponent>
				}
			</FormStyle>

			{/* Add theme modal */}
			<Modal
				isOpen={showAddThemeModal}
				close={() => setShowAddThemeModal(false)}>
				<Modal.Title>
					{messages.settings.theme.add.title}
				</Modal.Title>
				<Modal.Content>
					<AddTheme
						onSubmit={onAddTheme}
						close={() => setShowAddThemeModal(false)}
					/>
				</Modal.Content>
			</Modal>
		</ContentSection>
	)
}

ThemeSettings.propTypes = {
	settings: PropTypes.object.isRequired,
	guideUrl: PropTypes.string
}

const THEME_ID_REG_EXP = /^[a-zA-Z-_\d]+$/

function AddTheme({
	onSubmit,
	close
}) {
	const messages = useMessages()

	const form = useRef()
	const [pasteCodeInstead, setPasteCodeInstead] = useState()

	const userSettings = useSettings()

	// Focus the "Code" input after "Paste CSS code instead" has been clicked.
	useEffectSkipMount(() => {
		if (pasteCodeInstead) {
			if (form.current) {
				form.current.focus('css')
			}
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
		for (const theme of getThemes({ userSettings })) {
			if (value === theme.id) {
				return messages.settings.theme.add.alreadyExists
			}
		}
	}

	function validateName(value) {
		for (const theme of getThemes({ userSettings })) {
			if (value === theme.name) {
				return messages.settings.theme.add.alreadyExists
			}
		}
	}

	async function onSubmitForm(theme) {
		try {
			if (theme.css) {
				delete theme.url
			}
			addOrUpdateTheme(theme, { userSettings })
			await onSubmit(theme.id)
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
			ref={form}
			onSubmit={onSubmitForm}>
			<FormComponent>
				<Field
					required
					type="text"
					name="id"
					label={messages.settings.theme.add.id}
					validate={validateId}
				/>
			</FormComponent>
			<FormComponent>
				<Field
					required
					type="text"
					name="name"
					label={messages.settings.theme.add.name}
					validate={validateName}
				/>
			</FormComponent>
			{!pasteCodeInstead &&
				<FormComponent>
					<Field
						required
						type="text"
						name="url"
						label={messages.settings.theme.add.url}
						validate={validateCssUrl}
					/>
				</FormComponent>
			}
			{!pasteCodeInstead &&
				<FormComponent>
					<TextButton onClick={() => setPasteCodeInstead(true)}>
						{messages.settings.theme.add.pasteCodeInstead}
					</TextButton>
				</FormComponent>
			}
			{pasteCodeInstead &&
				<FormComponent>
					<Field
						required
						type="text"
						multiline
						name="css"
						label={messages.settings.theme.add.code}
						className="rrui__input--monospace"
					/>
				</FormComponent>
			}
			<FormActions>
				<FormAction>
					<TextButton onClick={close}>
						{messages.actions.cancel}
					</TextButton>
				</FormAction>
				<FormAction>
					<Submit component={FillButton}>
						{messages.actions.add}
					</Submit>
				</FormAction>
			</FormActions>
		</Form>
	)
}

AddTheme.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired
}