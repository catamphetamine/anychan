import type { EasyReactForm, EasyReactFormState } from '@/types'

import * as React from 'react'
import { useState, useCallback, useLayoutEffect } from 'react'
import * as PropTypes from 'prop-types'
import { isKeyCombination } from 'web-browser-input'
import classNames from 'classnames'

import { Form, Field, Submit, FormComponent } from './Form.js'

import LinearProgress from 'frontend-lib/components/LinearProgress.js'
// @ts-expect-error
import { Button, FadeInOut } from 'react-responsive-ui'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'
import useLayoutEffectSkipMount from 'frontend-lib/hooks/useLayoutEffectSkipMount.js'
// @ts-ignore
import useForwardedRef from 'frontend-lib/hooks/useForwardedRef.js'

// import SendIcon from 'frontend-lib/icons/send-plane-fill.svg'
import SendIcon from 'frontend-lib/icons/big-arrow-up-outline.svg'
import CancelIcon from 'frontend-lib/icons/close-thicker.svg'

import useMessages from '../hooks/useMessages.js'
import useDataSource from '../hooks/useDataSource.js'
import useProxyRequired from '../hooks/useProxyRequired.js'

import { attachment as attachmentType, attachmentFile as attachmentFileType } from '../PropTypes.js'

import './PostForm.css'

const PostForm = React.forwardRef<EasyReactForm, PostFormProps>(({
	expanded: expandedPropertyValue,
	onExpandedChange,
	unexpandOnClose,
	expandOnInteraction,
	placement,
	autoFocus,
	initialState,
	onStateDidChange,
	initialInputValue,
	onInputValueChange,
	initialError,
	onErrorDidChange,
	initialInputHeight,
	onInputHeightDidChange,
	onHeightDidChange,
	resetAfterSubmit,
	onAfterSubmit,
	onCancel: onCancel_,
	onSubmit: onSubmit_,
	onReset: onReset_,
	resetOnCancel,
	attachmentFiles,
	className,
	children
}, ref) => {
	const messages = useMessages()

	const { setRef: setForm, internalRef: form } = useForwardedRef(ref) // useForwardedRef<EasyReactForm>(ref)

	const [error, setError] = useState(initialError)
	const [loading, setLoading] = useState(false)

	const [hasInteracted, setHasInteracted] = useState(false)
	const [expanded, setExpanded] = useState(expandedPropertyValue)

	useEffectSkipMount(() => {
		if (onErrorDidChange) {
			onErrorDidChange(error)
		}
	}, [error])

	const applyExpandedValue = useCallback((value: boolean) => {
		setExpanded(value)
		if (onExpandedChange) {
			onExpandedChange(value)
		}
	}, [
		onExpandedChange
	])

	const unExpand = useCallback(() => {
		applyExpandedValue(false)
	}, [applyExpandedValue])

	useEffectSkipMount(() => {
		applyExpandedValue(expandedPropertyValue)
	}, [
		expandedPropertyValue
	])

	useLayoutEffectSkipMount(() => {
		if (onHeightDidChange) {
			onHeightDidChange()
		}
	}, [expanded])

	const onReset = useCallback(() => {
		if (form.current) {
			form.current.reset()
		}
		setError(undefined)
		if (onReset_) {
			onReset_()
		}
	}, [
		onReset_
	])

	const onCancel = useCallback(() => {
		if (onCancel_) {
			onCancel_()
		}
		if (expanded && unexpandOnClose) {
			unExpand()
		}
		if (resetOnCancel) {
			onReset()
		}
	}, [
		onCancel_,
		resetOnCancel,
		onReset,
		expanded,
		unexpandOnClose,
		unExpand
	])

	const onSubmit = useCallback(async (values: {
		[POST_FORM_INPUT_FIELD_NAME]?: string
	}) => {
		// If the text input is empty and there're no attachments then don't submit the form.
		const content = values[POST_FORM_INPUT_FIELD_NAME]
		if (!content && attachmentFiles.length === 0) {
			return
		}

		try {
			setLoading(true)
			await onSubmit_({
				attachmentFiles,
				content
			})
			if (resetAfterSubmit) {
				onReset()
			}
			if (onAfterSubmit) {
				onAfterSubmit()
			}
		} catch (error) {
			console.error(error)
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}, [
		onSubmit_,
		onReset,
		attachmentFiles,
		resetAfterSubmit,
		onAfterSubmit
	])

	const onInteraction = useCallback(() => {
		if (!hasInteracted) {
			setHasInteracted(true)
		}
		if (expandOnInteraction && !expanded) {
			applyExpandedValue(true)
		}
	}, [
		hasInteracted,
		expandOnInteraction,
		expanded,
		applyExpandedValue
	])

	const onInputKeyDown = useCallback((event: KeyboardEvent) => {
		if (isKeyCombination(event, ['Esc'])) {
			event.preventDefault()
			if (onCancel) {
				onCancel()
			}
		}
	}, [
		onCancel,
		onInteraction
	])

	const onInputValueChange_ = useCallback((value?: string) => {
		if (onInputValueChange) {
			onInputValueChange(value)
		}
		onInteraction()
	}, [
		onInputValueChange,
		onInteraction
	])

	const dataSource = useDataSource()
	const proxyRequired = useProxyRequired()

	const isPostingSupported = dataSource.supportsCreateComment() || dataSource.supportsCreateThread()
	const isPostingSupportedButNotWorking = dataSource.id === '4chan'

	const loadingIndicatorFadeOutDuration = 160 // ms

	// When passing an initial `value` property to a `<Field/>`,
	// it does set the input field's value, but it doesn't move the cursor
	// to the end of the input field. At least on Windows in Chrome in Oct 2023.
	// To work around that, manually call `input.setSelectionRange()` to reposition the caret.
	useLayoutEffect(() => {
		const input = form.current.getElement(POST_FORM_INPUT_FIELD_NAME)
		if (input && input.value) {
			input.setSelectionRange(input.value.length, input.value.length)
		}
	}, [])

	// Doesn't use `autoFocus={true}` property here by default.
	// The reason that if `autoFocus={true}` property is set
	// then the form would focus itself when rendered.
	// On a thread page, there's a list of comments,
	// and each comment can have a "Reply" form open by the user.
	// For the list of comments, `virtual-scroller` component
	// is used to unmount the comments that're off screen.
	// Therefore, when the user scrolls back to the comment
	// for which they had a "Reply" form open, `virtual-scroller`
	// re-mounts that form and the cursor jumps inside its input,
	// causing the page scroll position to jump accordingly.

	return (
		<section className={classNames(className, 'PostForm', {
			'PostForm--hasInteracted': hasInteracted,
			'PostForm--hasNotInteracted': !hasInteracted,
			'PostForm--notExpanded': !expanded,
			'PostForm--page': placement === 'page',
			'PostForm--comment': placement === 'comment'
		})}>
			<Form
				ref={setForm}
				autoFocus={autoFocus}
				onSubmit={onSubmit}
				initialState={initialState}
				onStateDidChange={onStateDidChange}
				className={classNames('form', 'PostForm-form')}>
				<FormComponent className="PostForm-textInputContainer">
					<Field
						name={POST_FORM_INPUT_FIELD_NAME}
						type="text"
						multiline
						rows={expanded ? 2 : 1}
						value={initialInputValue}
						onFocus={onInteraction}
						onClick={onInteraction}
						onChange={onInputValueChange_}
						initialHeight={initialInputHeight}
						onHeightChange={onInputHeightDidChange}
						onKeyDown={placement === 'comment' ? onInputKeyDown : undefined}
						placeholder={messages.post.form.inputText}
					/>
				</FormComponent>
				{onCancel && expanded &&
					<Button
						onClick={onCancel}
						title={messages.actions.close}
						className="PostForm-close">
						<CancelIcon className="PostForm-closeIcon"/>
					</Button>
				}
				<Submit
					component={Button}
					title={messages.actions.post}
					className="PostForm-action">
					{/*messages.actions.post*/}
					<SendIcon className="PostForm-actionIcon"/>
				</Submit>
				<FadeInOut show={loading} fadeOutDuration={loadingIndicatorFadeOutDuration}>
					<LinearProgress className="PostForm-loading"/>
				</FadeInOut>
			</Form>
			{error &&
				<p className="PostForm-error">
					{error}
				</p>
			}
			{isPostingSupported && isPostingSupportedButNotWorking &&
				<p className="PostForm-notWorkingNotice">
					{messages.doesNotWorkForTheDataSource}
				</p>
			}
			{isPostingSupported && proxyRequired &&
				<p className="PostForm-proxyCaution">
					{messages.proxyPostingCaution}
				</p>
			}
			{!isPostingSupported &&
				<p className="PostForm-notImplementedNotice">
					{messages.notImplementedForTheDataSource}
				</p>
			}
			{children}
		</section>
	)
})

PostForm.propTypes = {
	expanded: PropTypes.bool,
	onExpandedChange: PropTypes.func,
	unexpandOnClose: PropTypes.bool,
	expandOnInteraction: PropTypes.bool,
	placement: PropTypes.oneOf(['page', 'comment'] as const).isRequired,
	autoFocus: PropTypes.bool,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
	onReset: PropTypes.func,
	resetOnCancel: PropTypes.bool,
	attachmentFiles: PropTypes.arrayOf(attachmentFileType),
	initialState: PropTypes.object,
	onStateDidChange: PropTypes.func,
	initialError: PropTypes.string,
	onErrorDidChange: PropTypes.func,
	initialInputValue: PropTypes.string,
	onInputValueChange: PropTypes.func,
	initialInputHeight: PropTypes.number,
	onInputHeightDidChange: PropTypes.func,
	onHeightDidChange: PropTypes.func,
	resetAfterSubmit: PropTypes.bool,
	onAfterSubmit: PropTypes.func,
	className: PropTypes.string,
	children: PropTypes.node
}

interface PostFormProps {
	expanded?: boolean,
	onExpandedChange?: (expanded: boolean) => void,
	unexpandOnClose?: boolean,
	expandOnInteraction?: boolean,
	placement: 'page' | 'comment',
	autoFocus?: boolean,
	onCancel?: () => void,
	onSubmit: (parameters: {
		attachmentFiles: (File | Blob)[],
		content?: string
	}) => Promise<void>,
	onReset?: () => void,
	resetOnCancel?: boolean,
	attachmentFiles: (File | Blob)[],
	initialState?: EasyReactFormState,
	onStateDidChange?: (newState: EasyReactFormState) => void,
	initialError?: string,
	onErrorDidChange?: (error?: string) => void,
	initialInputValue?: string,
	onInputValueChange?: (value?: string) => void,
	initialInputHeight?: number,
	onInputHeightDidChange?: (height: number) => void,
	onHeightDidChange?: () => void,
	resetAfterSubmit?: boolean
	onAfterSubmit?: () => void,
	className?: string,
	children?: React.ReactNode
}

export default PostForm

export const POST_FORM_INPUT_FIELD_NAME = 'content'