import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { TextInput, Button } from 'react-responsive-ui'
import { Form, Field, Submit } from 'easy-react-form'

// import SendPlaneIcon from 'frontend-lib/icons/send-plane-fill.svg'

import useMessages from '../hooks/useMessages.js'

import './PostForm.css'

function PostForm({
	autoFocus,
	initialContent,
	initialState,
	onStateChange,
	onCancel,
	onSubmit
}, ref) {
	const messages = useMessages()

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
			className="PostForm form">
			<Field
				required
				name="content"
				component={TextInput}
				multiline
				rows={1}
				placeholder={messages.post.form.inputText}
				value={initialContent}
				className="form__component PostForm-textInput"
			/>
			{onCancel &&
				<Button
					onClick={onCancel}
					className="PostForm-action">
					{messages.actions.cancel}
				</Button>
			}
			<Submit
				component={Button}
				type="submit"
				title={messages.actions.post}
				className="PostForm-action">
				{messages.actions.post}
				{/*<SendPlaneIcon className="PostForm-actionIcon"/>*/}
			</Submit>
		</Form>
	)
}

PostForm = React.forwardRef(PostForm)

PostForm.propTypes = {
	autoFocus: PropTypes.bool,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
	initialContent: PropTypes.string
}

export default PostForm