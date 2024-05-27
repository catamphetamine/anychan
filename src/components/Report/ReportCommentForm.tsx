import type { ChannelId, ThreadId, CommentId } from '@/types'

import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error
import { Switcher } from 'react-responsive-ui'

import { Form, Field, Submit, FormComponent, FormActions, FormAction } from '../Form.js'
import TextButton from '../TextButton.js'
import FillButton from '../FillButton.js'

import useReportComment from './useReportComment.js'

import { useMessages, useDataSource, useProxyRequired, useMessage } from '@/hooks'

import './ReportCommentForm.css'

export default function ReportCommentForm({
	channelId,
	threadId,
	commentId,
	autoFocus,
	setSubmitting,
	onAfterSubmit,
	onCancel
}: ReportCommentFormProps) {
	const messages = useMessages()
	const dataSource = useDataSource()
	const proxyRequired = useProxyRequired()

	const [violationType, setViolationType] = useState<ViolationType>()
	const [violationTypeRequiredError, setShowViolationTypeRequiredError] = useState(false)

	const legalViolationReasonId = dataSource.reportReasonForLegalViolation?.id
	const canReportLegalViolation = Boolean(legalViolationReasonId)

	const {
		onSubmitReport
	} = useReportComment({
		channelId,
		threadId,
		commentId
	})

	const onSubmitForm = useCallback(async ({ content, reasonId }: FormValues) => {
		if (canReportLegalViolation && !violationType) {
			setShowViolationTypeRequiredError(true)
			return
		}
		try {
			if (setSubmitting) {
				setSubmitting(true)
			}
			if (canReportLegalViolation) {
				if (violationType === 'law') {
					reasonId = legalViolationReasonId
				}
			}
			await onSubmitReport({ content, reasonId })
			if (onAfterSubmit) {
				onAfterSubmit()
			}
		} finally {
			if (setSubmitting) {
				setSubmitting(false)
			}
		}
	}, [
		canReportLegalViolation,
		violationType,
		onSubmitReport,
		setSubmitting,
		onAfterSubmit
	])

	const reportViolationTypeOptions = useMemo(() => [{
		value: 'rules',
		label: messages.report.form.violationType.rules
	}, {
		value: 'law',
		label: messages.report.form.violationType.countryLaw.US
	}], [
		messages
	])

	const chooseReportViolationTypeMessageParameters = useMemo(() => ({
		rulesLink: (children: string) => {
			if (dataSource.getChannelRulesUrl) {
				return (
					<a target="_blank" href={dataSource.getChannelRulesUrl(channelId)}>
						{children}
					</a>
				)
			}
		},
		countryLaw: messages.report.form.chooseViolationType.countryLaw.US
	}), [
		channelId,
		dataSource,
		messages
	])

	const chooseReportViolationTypeMessage = useMessage(
		messages.report.form.chooseViolationType.text,
		chooseReportViolationTypeMessageParameters
	)

	const reportReasonOptionsForRulesViolation = useMemo(() => {
		let reportReasons = dataSource.reportReasons || []
		if (legalViolationReasonId) {
			reportReasons = reportReasons.filter(_ => _.id !== legalViolationReasonId)
		}
		reportReasons = reportReasons.filter((reportReason) => {
			return !reportReason.channelIds || reportReason.channelIds.includes(channelId);
		});
		return reportReasons.map((reason) => ({
			value: reason.id,
			label: reason.description
		}))
	}, [
		dataSource.reportReasons,
		legalViolationReasonId
	])

	return (
		<Form
			autoFocus={autoFocus}
			onSubmit={onSubmitForm}>
			{dataSource.id === '4chan' ? (
				<>
					{canReportLegalViolation && (
						<>
							<p className="ReportCommentForm-chooseReportViolationTypeText">
								{chooseReportViolationTypeMessage}
							</p>
							<Switcher
								value={violationType}
								onChange={setViolationType}
								options={reportViolationTypeOptions}
							/>
							{violationTypeRequiredError &&
								<p className="ReportCommentForm-chooseReportViolationTypeRequiredError">
									{messages.report.form.error.violationTypeRequired}
								</p>
							}
						</>
					)}
					{(!canReportLegalViolation || violationType === 'rules') && (
						<FormComponent>
							<Field
								required
								name="reasonId"
								type="select"
								options={reportReasonOptionsForRulesViolation}
								placeholder={messages.report.form.reason}
							/>
						</FormComponent>
					)}
				</>
			) : (
				<FormComponent>
					<Field
						required
						name="content"
						type="text"
						multiline
						rows={2}
						placeholder={messages.report.form.content}
					/>
				</FormComponent>
			)}
			{(dataSource.id === '2ch' || dataSource.id === '4chan') &&
				<p className="PostForm-notWorkingNotice">
					{messages.doesNotWorkForTheDataSource}
				</p>
			}
			{dataSource.supportsReportComment() && proxyRequired &&
				<p className="ReportCommentForm-proxyCaution">
					{messages.proxyPostingCaution}
				</p>
			}
			<p className="ReportCommentForm-misuseWarning">
				{messages.report.misuseWarning}
			</p>
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

interface ReportCommentFormProps {
	channelId: ChannelId,
	threadId: ThreadId,
	commentId: CommentId,
	autoFocus?: boolean,
	setSubmitting?: (submitting: boolean) => void,
	onAfterSubmit?: () => void,
	onCancel?: () => void
}

interface FormValues {
	content: string;
	reasonId: string | number;
}

type ViolationType = 'rules' | 'law'
