import React, { useState, useCallback, useMemo, useRef, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Button } from 'react-responsive-ui'
import { isKeyCombination } from 'web-browser-input'
import classNames from 'classnames'

import { Form, Field, Submit, FormComponent } from './Form.js'

import LinearProgress from 'frontend-lib/components/LinearProgress.js'
import { FadeInOut } from 'react-responsive-ui'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'
import useLayoutEffectSkipMount from 'frontend-lib/hooks/useLayoutEffectSkipMount.js'

// import SendIcon from 'frontend-lib/icons/send-plane-fill.svg'
import SendIcon from 'frontend-lib/icons/big-arrow-up-outline.svg'
import CancelIcon from 'frontend-lib/icons/close-thicker.svg'

import shouldUseProxy from '../utility/proxy/shouldUseProxy.js'

import useMessages from '../hooks/useMessages.js'
import useDataSource from '../hooks/useDataSource.js'

import './PostForm.css'

function PostForm({
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
	additionalSubmitValues,
	className,
	children
}, ref) {
	const messages = useMessages()

	const form = useRef()
	const setForm = (instance) => {
		form.current = instance
		if (ref) {
			if (typeof ref === 'function') {
				ref(instance)
			} else {
				ref.current = instance
			}
		}
	}

	const [error, setError] = useState(initialError)
	const [loading, setLoading] = useState(false)

	const [hasInteracted, setHasInteracted] = useState(false)
	const [expanded, setExpanded] = useState(expandedPropertyValue)

	const accessToken = useSelector(state => state.auth.accessToken)

	useEffectSkipMount(() => {
		if (onErrorDidChange) {
			onErrorDidChange(error)
		}
	}, [error])

	const applyExpandedValue = useCallback((value) => {
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
		setError()
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

	const onSubmit = useCallback(async (values) => {
		try {
			setLoading(true)
			await onSubmit_({
				...additionalSubmitValues,
				content: values[POST_FORM_INPUT_FIELD_NAME]
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
		additionalSubmitValues,
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

	const onInputKeyDown = useCallback((event) => {
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

	const onInputValueChange_ = useCallback((value) => {
		if (onInputValueChange) {
			onInputValueChange(value)
		}
		onInteraction()
	}, [
		onInputValueChange,
		onInteraction
	])

	const dataSource = useDataSource()

	const isPostingSupported = dataSource.supportsCreateComment() || dataSource.supportsCreateThread()
	const isPostingSupportedButNotWorking = dataSource.id === '4chan'

	const doesUseProxy = useMemo(() => {
		return shouldUseProxy({ dataSource })
	}, [dataSource])

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
			{isPostingSupported && doesUseProxy &&
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
}

PostForm = React.forwardRef(PostForm)

PostForm.propTypes = {
	expanded: PropTypes.bool,
	onExpandedChange: PropTypes.func,
	unexpandOnClose: PropTypes.bool,
	expandOnInteraction: PropTypes.bool,
	placement: PropTypes.oneOf(['page', 'comment']).isRequired,
	autoFocus: PropTypes.bool,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
	onReset: PropTypes.func,
	resetOnCancel: PropTypes.bool,
	additionalSubmitValues: PropTypes.object,
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

export default PostForm

export const POST_FORM_INPUT_FIELD_NAME = 'content'