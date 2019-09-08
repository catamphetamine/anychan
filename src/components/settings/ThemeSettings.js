import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Select, TextInput } from 'react-responsive-ui'

import { Form, Field, Submit } from 'webapp-frontend/src/components/Form'
import OkCancelDialog from 'webapp-frontend/src/components/OkCancelDialog'
import { validateUrl, validateRelativeUrl } from 'webapp-frontend/src/utility/url'
import { okCancelDialog } from 'webapp-frontend/src/redux/okCancelDialog'

import { saveTheme } from '../../redux/app'

import {
	getThemes,
	isBuiltInTheme,
	addTheme,
	removeTheme,
	applyTheme
} from '../../utility/themes'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

const CSS_URL_REGEXP = /\.css(\?.*)?$/

export default function ThemeSettings({
	messages,
	settings,
	dispatch,
	guideUrl
}) {
	const [showAddThemeModal, setShowAddThemeModal] = useState()

	const value = settings.theme

	async function onSaveTheme(name) {
		await applyTheme(name)
		dispatch(saveTheme(name))
	}

	async function deleteCurrentTheme() {
		dispatch(okCancelDialog(messages.settings.theme.deleteCurrent.warning.replace('{0}', value)))
		if (await OkCancelDialog.getPromise()) {
			removeTheme(value)
			await onSaveTheme(getThemes()[0].name)
		}
	}

	const options = getThemes().map((theme) => ({
		value: theme.name,
		label: messages.settings.theme.themes[theme.name] || theme.name
	}))

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.theme.title}
			</ContentSectionHeader>

			<div className="form">
				<Select
					value={value}
					options={options}
					onChange={onSaveTheme}
					className="form__component"/>
				<div className="form__component form__component--button">
					<Button
						onClick={() => setShowAddThemeModal(true)}
						className="rrui__button--text">
						{messages.settings.theme.add.title}
					</Button>
				</div>
				{guideUrl &&
					<div className="form__component form__component--button">
						<a
							href={guideUrl}
							target="_blank">
							{messages.settings.theme.readThemesGuide}
						</a>
					</div>
				}
				{!isBuiltInTheme(value) &&
					<div className="form__component form__component--button">
						<Button
							onClick={deleteCurrentTheme}
							className="rrui__button--text">
							{messages.settings.theme.deleteCurrent.title}
						</Button>
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
						saveTheme={onSaveTheme}
						close={() => setShowAddThemeModal(false)}/>
				</Modal.Content>
			</Modal>
		</ContentSection>
	)
}

ThemeSettings.propTypes = {
	messages: PropTypes.object.isRequired,
	settings: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	guideUrl: PropTypes.string
}

function AddTheme({
	messages,
	saveTheme,
	close
}) {
	const addThemeForm = useRef()
	const [pasteCodeInstead, setPasteCodeInstead] = useState()

	// Focus the "Code" input after "Paste CSS code instead" has been clicked.
	useEffect(() => {
		if (pasteCodeInstead) {
			addThemeForm.current.getWrappedInstance().focus('code')
		}
	}, [pasteCodeInstead])

	function validateCssUrl(value) {
		if (!validateUrl(value) && !validateRelativeUrl(value)) {
			return messages.settings.theme.add.invalidUrl
		}
		if (!CSS_URL_REGEXP.test(value)) {
			return messages.settings.theme.add.invalidExtension
		}
	}

	async function onAddTheme(theme) {
		try {
			if (theme.code) {
				delete theme.url
			}
			addTheme(theme)
			await saveTheme(theme.name, getThemes().concat(theme))
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
				name="name"
				label={messages.settings.theme.add.name}
				component={TextInput}
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
				<Button
					onClick={() => setPasteCodeInstead(true)}
					className="rrui__button--text form__component">
					{messages.settings.theme.add.pasteCodeInstead}
				</Button>
			}
			{pasteCodeInstead &&
				<Field
					required
					multiline
					name="code"
					label={messages.settings.theme.add.code}
					component={TextInput}
					className="form__component rrui__input--monospace"/>
			}
			<div className="form__actions">
				<Button
					onClick={close}
					className="rrui__button--text form__action">
					{messages.actions.cancel}
				</Button>
				<Submit
					submit
					component={Button}
					className="rrui__button--background form__action">
					{messages.actions.add}
				</Submit>
			</div>
		</Form>
	)
}

AddTheme.propTypes = {
	messages: PropTypes.object.isRequired,
	saveTheme: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired
}