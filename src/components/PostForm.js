import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { TextInput, Button } from 'react-responsive-ui'
import { isKeyCombination } from 'web-browser-input'
import classNames from 'classnames'

import { Form, Field, Submit } from './Form.js'

import LinearProgress from 'frontend-lib/components/LinearProgress.js'
import { FadeInOut } from 'react-responsive-ui'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

// import SendIcon from 'frontend-lib/icons/send-plane-fill.svg'
import SendIcon from 'frontend-lib/icons/big-arrow-up-outline.svg'
import CancelIcon from 'frontend-lib/icons/close-thicker.svg'

import useMessages from '../hooks/useMessages.js'

import './PostForm.css'

function PostForm({
	placement,
	autoFocus,
	initialState,
	onStateDidChange,
	initialInputValue,
	onInputValueChange,
	initialError,
	onErrorDidChange,
	initialInputHeight,
	onInputHeightChange,
	onCancel,
	onSubmit: onSubmit_
}, ref) {
	const messages = useMessages()

	const [error, setError] = useState(initialError)
	const [loading, setLoading] = useState()

	useEffectSkipMount(() => {
		if (onErrorDidChange) {
			onErrorDidChange(error)
		}
	}, [error])

	const onSubmit = useCallback(async (values) => {
		try {
			setLoading(true)
			await onSubmit_(values)
		} catch (error) {
			console.error(error)
			setError(error.message)
		} finally {
			setLoading(false)
		}
	})

	const onInputKeyDown = useCallback((event) => {
		if (isKeyCombination(event, ['Esc'])) {
			event.preventDefault()
			onCancel()
		}
	}, [])

	const loadingIndicatorFadeOutDuration = 160 // ms

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
		<Form
			ref={ref}
			autoFocus={autoFocus}
			requiredMessage={messages.form.error.required}
			onSubmit={onSubmit}
			initialState={initialState}
			onStateDidChange={onStateDidChange}
			className={classNames('form', 'PostForm', {
				'PostForm--page': placement === 'page',
				'PostForm--comment': placement === 'comment'
			})}>
			<Field
				required
				name={POST_FORM_INPUT_FIELD_NAME}
				type="text"
				multiline
				rows={2}
				value={initialInputValue}
				onChange={onInputValueChange}
				initialHeight={initialInputHeight}
				onHeightChange={onInputHeightChange}
				onKeyDown={placement === 'comment' ? onInputKeyDown : undefined}
				placeholder={messages.post.form.inputText}
				className="form__component PostForm-textInput"
			/>
			{onCancel &&
				<Button
					onClick={onCancel}
					title={messages.actions.close}
					className="PostForm-close">
					<CancelIcon className="PostForm-closeIcon"/>
				</Button>
			}
			<Submit
				component={Button}
				type="submit"
				title={messages.actions.post}
				className="PostForm-action">
				{/*messages.actions.post*/}
				<SendIcon className="PostForm-actionIcon"/>
			</Submit>
			{error &&
				<div className="PostForm-error">
					{error}
				</div>
			}
			<FadeInOut show={loading} fadeOutDuration={loadingIndicatorFadeOutDuration}>
				<LinearProgress className="PostForm-loading"/>
			</FadeInOut>
		</Form>
	)
}

PostForm = React.forwardRef(PostForm)

PostForm.propTypes = {
	placement: PropTypes.oneOf(['page', 'comment']).isRequired,
	autoFocus: PropTypes.bool,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
	initialState: PropTypes.object,
	onStateDidChange: PropTypes.func,
	initialError: PropTypes.string,
	onErrorDidChange: PropTypes.func,
	initialInputValue: PropTypes.string,
	onInputValueChange: PropTypes.func,
	initialInputHeight: PropTypes.number,
	onInputHeightChange: PropTypes.func
}

export default PostForm

export const POST_FORM_INPUT_FIELD_NAME = 'content'