import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { Form, Field, Submit, FormComponent, FormActions, FormAction } from '../Form.js'
import TextButton from '../TextButton.js'
import FillButton from '../FillButton.js'

import useReportComment from './useReportComment.js'

import useMessages from '../../hooks/useMessages.js'

export default function ReportCommentForm({
	channelId,
	threadId,
	commentId,
	autoFocus,
	setSubmitting,
	onAfterSubmit,
	onCancel
}) {
	const messages = useMessages()

	const {
		onSubmitReport
	} = useReportComment({
		channelId,
		threadId,
		commentId
	})

	const onSubmitForm = useCallback(async ({ content }) => {
		try {
			if (setSubmitting) {
				setSubmitting(true)
			}
			await onSubmitReport({ content })
			if (onAfterSubmit) {
				onAfterSubmit()
			}
		} finally {
			if (setSubmitting) {
				setSubmitting(false)
			}
		}
	}, [
		onSubmitReport,
		setSubmitting,
		onAfterSubmit
	])

	return (
		<Form
			autoFocus={autoFocus}
			onSubmit={onSubmitForm}
			className="form">
			<FormComponent>
				<Field
					required
					name="content"
					type="text"
					multiline
					rows={2}
					placeholder={messages.report.contentInputLabel}
				/>
			</FormComponent>
			<FormActions>
				{onCancel &&
					<FormAction>
						<TextButton onClick={onCancel}>
							{messages.actions.cancel}
						</TextButton>
					</FormAction>
				}
				<FormAction>
					<Submit component={FillButton}>
						{messages.actions.send}
					</Submit>
				</FormAction>
			</FormActions>
		</Form>
	)
}

ReportCommentForm.propTypes = {
	channelId: PropTypes.string.isRequired,
	threadId: PropTypes.number.isRequired,
	commentId: PropTypes.number.isRequired,
	autoFocus: PropTypes.bool,
	setSubmitting: PropTypes.func,
	onAfterSubmit: PropTypes.func,
	onCancel: PropTypes.func
}