import React, { useCallback, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import { Switch } from 'react-responsive-ui'
import OkCancelModal from 'frontend-lib/components/OkCancelModal.js'
import { Form, Field, Submit, FormComponent, FormActions, FormAction } from '../Form.js'
import FillButton from '../FillButton.js'

import { saveCss } from '../../redux/settings.js'

import {
	applyCustomCss
} from '../../utility/themes.ts'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import useMessages from '../../hooks/useMessages.js'
import useSettings from '../../hooks/useSettings.js'

export default function CssSettings({
	value
}) {
	const messages = useMessages()
	const userSettings = useSettings()

	const dispatch = useDispatch()

	const formRef = useRef()

	const onSave = useCallback(async ({ css }) => {
		await applyCustomCss(css)
		dispatch(saveCss({ css, userSettings }))
	}, [])

	const [isEnabled, setEnabled] = useState(Boolean(value))
	const [isSwitchInteractive, setSwitchInteractive] = useState(true)

	const onSetEnabled = useCallback(async (isEnabledValue) => {
		if (isEnabledValue) {
			setEnabled(true)
		} else {
			if (value) {
				if (await OkCancelModal.show({
					text: messages.settings.css.deleteWarning
				})) {
					try {
						setSwitchInteractive(false)
						await onSave({ css: undefined })
						setEnabled(false)
					} finally {
						setSwitchInteractive(true)
					}
				}
			} else {
				setEnabled(false)
			}
		}
	}, [value])

	useEffectSkipMount(() => {
		if (isEnabled) {
			if (formRef.current) {
				formRef.current.focus()
			}
		}
	}, [isEnabled])

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.css.title}
			</ContentSectionHeader>

			<Switch
				value={isEnabled}
				onChange={onSetEnabled}
				disabled={!isSwitchInteractive}
				placement="left">
				{isEnabled ? messages.status.enabled : messages.status.disabled}
			</Switch>

			{isEnabled &&
				<Form ref={formRef} onSubmit={onSave}>
					<FormComponent>
						<Field
							required
							type="text"
							multiline
							name="css"
							defaultValue={value}
							placeholder={messages.settings.theme.add.code}
							className="rrui__input--monospace"
						/>
					</FormComponent>
					<FormActions>
						<FormAction>
							<Submit component={FillButton}>
								{messages.actions.save}
							</Submit>
						</FormAction>
					</FormActions>
				</Form>
			}
		</ContentSection>
	)
}

CssSettings.propTypes = {
	value: PropTypes.string
}