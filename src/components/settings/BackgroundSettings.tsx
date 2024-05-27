import type { Background } from '../../types/index.js'

import React, { useRef, useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Select from '../Select.js'
import TextButton from '../TextButton.js'
import FillButton from '../FillButton.js'

// @ts-expect-error
import { Modal, Switch } from 'react-responsive-ui'

import { Form, Field, Submit, FormStyle, FormComponent, FormActions, FormAction } from '../Form.js'
import OkCancelModal from 'frontend-lib/components/OkCancelModal.js'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import useMessages from '../../hooks/useMessages.js'
import useSettings from '../../hooks/useSettings.js'

import { getDefaultBackgroundId } from '../../utility/settings/settingsDefaults.js'

import {
	getBackground,
	getBackgrounds,
	applyBackground,
	isBuiltInBackground,
	addOrUpdateBackground,
	removeBackground
} from '../../utility/background.js'

export default function BackgroundSettings({
	type,
	value,
	onChange
}: BackgroundSettingsProps) {
	const userSettings = useSettings()
	const messages = useMessages()

	const dispatch = useDispatch()

	const currentBackgroundId: Background['id'] = value

	// Added a "dummy" state variable in order to re-trigger `useMemo()` below
	// when a user saves some changes to current background.
	const [currentBackgroundUpdateFlag, setCurrentBackgroundUpdateFlag] = useState<{}>()

	const currentBackground = useMemo(() => {
		return getBackground(currentBackgroundId, type, { userSettings })
	}, [currentBackgroundId, currentBackgroundUpdateFlag, type, userSettings])

	const [isEnabled, setEnabled] = useState(Boolean(currentBackgroundId))
	const [isSwitchInteractive, setSwitchInteractive] = useState(true)

	const [showBackgroundModal, setShowBackgroundModal] = useState(false)
	const [backgroundModalMode, setBackgroundModalMode] = useState<'add' | 'edit'>()

	async function onSelectBackground(id: Background['id']) {
		applyBackground(id, type, { dispatch, userSettings })
		onChange(id)
	}

	const onSetEnabled = useCallback(async (isEnabledValue?: boolean) => {
		if (isEnabledValue) {
			setEnabled(true)
			// Select a random background when enabling background.
			if (!currentBackgroundId) {
				try {
					setSwitchInteractive(false)
					await onSelectBackground(getDefaultBackgroundId(type))
				} finally {
					setSwitchInteractive(true)
				}
			}
		} else {
			try {
				setSwitchInteractive(false)
				await onSelectBackground(null)
			} finally {
				setSwitchInteractive(true)
			}
			setEnabled(false)
		}
	}, [currentBackgroundId, type])

	async function onAddBackground(id: Background['id']) {
		try {
			await applyBackground(id, type, { dispatch, userSettings })
		} catch (error) {
			removeBackground(id, type, { userSettings })
			throw error
		}
		onChange(id)
	}

	async function onUpdateBackground(id: Background['id']) {
		await applyBackground(id, type, { dispatch, userSettings })
		setCurrentBackgroundUpdateFlag({})
	}

	async function onRemoveSelectedBackground() {
		if (await OkCancelModal.show({
			text: messages.settings.background.deleteCurrent.warning.replace('{background}', currentBackgroundId)
		})) {
			removeBackground(currentBackgroundId, type, { userSettings })
			await onSelectBackground(getDefaultBackgroundId(type))
		}
	}

	const options = getBackgrounds(type, { userSettings }).map((background) => ({
		value: background.id,
		label: background.name || background.id
	}))

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.background.title[type]}
			</ContentSectionHeader>

			<Switch
				value={isEnabled}
				onChange={onSetEnabled}
				disabled={!isSwitchInteractive}
				placement="left">
				{isEnabled ? messages.status.enabled : messages.status.disabled}
			</Switch>

			{isEnabled && (
				<FormStyle>
					<FormComponent>
						<Select
							value={currentBackgroundId}
							options={options}
							onChange={onSelectBackground}
						/>
					</FormComponent>
					<FormComponent type="button">
						<TextButton
							onClick={() => {
								setBackgroundModalMode('add')
								setShowBackgroundModal(true)
							}}>
							{messages.settings.background.add.title}
						</TextButton>
					</FormComponent>
					{!isBuiltInBackground(currentBackgroundId, type) &&
						<>
							<FormComponent type="button">
								<TextButton
									onClick={() => {
										setBackgroundModalMode('edit')
										setShowBackgroundModal(true)
									}}>
									{messages.settings.background.editCurrent}
								</TextButton>
							</FormComponent>
							<FormComponent type="button">
								<TextButton
									onClick={onRemoveSelectedBackground}>
									{messages.settings.background.deleteCurrent.title}
								</TextButton>
							</FormComponent>
						</>
					}
				</FormStyle>
			)}

			{/* Add background modal */}
			<Modal
				isOpen={showBackgroundModal}
				close={() => setShowBackgroundModal(false)}>
				<Modal.Title>
					{backgroundModalMode === 'add'
						? messages.settings.background.add.title
						: messages.settings.background.edit.title
					}
				</Modal.Title>
				<Modal.Content>
					<BackgroundForm
						type={type}
						background={backgroundModalMode === 'add' ? undefined : currentBackground}
						onSubmit={backgroundModalMode === 'add' ? onAddBackground : onUpdateBackground}
						close={() => setShowBackgroundModal(false)}
					/>
				</Modal.Content>
			</Modal>
		</ContentSection>
	)
}

BackgroundSettings.propTypes = {
	type: PropTypes.oneOf(['dark', 'light']).isRequired,
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired
}

interface BackgroundSettingsProps {
	type: 'dark' | 'light',
	value?: Background['id'],
	onChange: (value?: Background['id']) => void
}

const BACKGROUND_ID_REG_EXP = /^[a-zA-Z-_\d]+$/

interface BackgroundFormProps {
	type: 'dark' | 'light';
	background?: Background;
	onSubmit: (id: Background['id']) => Promise<void>;
	close: () => void;
}

function BackgroundForm({
	type,
	background,
	onSubmit,
	close
}: BackgroundFormProps) {
	const messages = useMessages()

	const form = useRef<any>()
	const [isCustomImage, setIsCustomImage] = useState<boolean>(background ? Boolean(background.patternUrl) : false)

	const userSettings = useSettings()

	// Focus the "Code" input after "Paste CSS code instead" has been clicked.
	useEffectSkipMount(() => {
		if (isCustomImage) {
			if (form.current) {
				form.current.focus('patternUrl')
			}
		}
	}, [isCustomImage])

	const onSetIsCustomImage = useCallback((value?: boolean) => {
		setIsCustomImage(value)
	}, [])

	function validateId(value: string) {
		if (!BACKGROUND_ID_REG_EXP.test(value)) {
			return messages.settings.background.form.error.invalidId
		}
		for (const background of getBackgrounds(type, { userSettings })) {
			if (value === background.id) {
				return messages.settings.background.form.error.alreadyExists
			}
		}
	}

	function validateName(value: string) {
		for (const background of getBackgrounds(type, { userSettings })) {
			if (value === background.name) {
				return messages.settings.background.form.error.alreadyExists
			}
		}
	}

	function validateAngle(value: string) {
		const numericValue = Number(value)
		if (String(numericValue) !== value) {
			return messages.form.error.invalid
		}
		if (numericValue < 0 || numericValue > 360) {
			return messages.form.error.invalid
		}
	}

	function validateOpacity(value: string) {
		const numericValue = Number(value)
		if (String(numericValue) !== value) {
			return messages.form.error.invalid
		}
		if (numericValue < 0 || numericValue > 1) {
			return messages.form.error.invalid
		}
	}

	interface FormValues {
		id: string;
		name: string;
		gradientColor1: string;
		gradientColor2: string;
		gradientAngle?: string;
		patternUrl?: string;
		patternSize?: string;
		patternOpacity?: number;
	}

	async function onSubmitForm(values: FormValues) {
		try {
			if (!isCustomImage) {
				delete values.patternUrl
				delete values.patternSize
			}
			const backgroundProperties = {
				...values,
				gradientAngle: values.gradientAngle ? Number(values.gradientAngle) : undefined,
				patternOpacity: values.patternOpacity ? Number(values.patternOpacity) : undefined
			}
			addOrUpdateBackground(backgroundProperties, type, { userSettings })
			await onSubmit(values.id)
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
					readOnly={Boolean(background)}
					type="text"
					name="id"
					label={messages.settings.background.form.id}
					defaultValue={background && background.id}
					validate={background ? undefined : validateId}
				/>
			</FormComponent>

			<FormComponent>
				<Field
					required
					readOnly={Boolean(background)}
					type="text"
					name="name"
					label={messages.settings.background.form.name}
					defaultValue={background && background.name}
					validate={background ? undefined : validateName}
				/>
			</FormComponent>

			<FormComponent>
				<Field
					required
					type="text"
					name="gradientColor1"
					label={messages.settings.background.form.gradientColor1}
					defaultValue={background && background.gradientColor1}
				/>
			</FormComponent>

			<FormComponent>
				<Field
					required
					type="text"
					name="gradientColor2"
					label={messages.settings.background.form.gradientColor2}
					defaultValue={background && background.gradientColor2}
				/>
			</FormComponent>

			<FormComponent>
				<Field
					type="text"
					name="gradientAngle"
					label={messages.settings.background.form.gradientAngle}
					defaultValue={background && (typeof background.gradientAngle === 'number' ? String(background.gradientAngle) : undefined)}
					validate={validateAngle}
				/>
			</FormComponent>

			<FormComponent>
				<Field
					type="text"
					name="backgroundColor"
					label={messages.settings.background.form.backgroundColor}
					defaultValue={background && background.backgroundColor}
				/>
			</FormComponent>

			<FormComponent>
				<Field
					type="text"
					name="patternSize"
					placeholder="22em"
					label={messages.settings.background.form.imageSize}
					defaultValue={background && background.patternSize}
				/>
			</FormComponent>

			<FormComponent>
				<Field
					type="text"
					name="patternOpacity"
					label={messages.settings.background.form.imageOpacity}
					defaultValue={background && (typeof background.patternOpacity === 'number' ? String(background.patternOpacity) : undefined)}
					validate={validateOpacity}
				/>
			</FormComponent>

			<FormComponent>
				<Switch
					value={isCustomImage}
					onChange={onSetIsCustomImage}
					placement="left">
					{messages.settings.background.form.customImage}
				</Switch>
			</FormComponent>

			{isCustomImage &&
				<>
					<FormComponent>
						<Field
							required
							type="text"
							name="patternUrl"
							label={messages.settings.background.form.imageUrl}
							defaultValue={background && background.patternUrl}
						/>
					</FormComponent>
				</>
			}

			<FormActions>
				<FormAction>
					<TextButton onClick={close}>
						{messages.actions.cancel}
					</TextButton>
				</FormAction>
				<FormAction>
					<Submit component={FillButton}>
						{background ? messages.actions.save : messages.actions.add}
					</Submit>
				</FormAction>
			</FormActions>
		</Form>
	)
}

BackgroundForm.propTypes = {
	type: PropTypes.oneOf(['dark', 'light']).isRequired,
	background: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired
}