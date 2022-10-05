import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { TextInput, Button } from 'react-responsive-ui'
import { Form, Field, Submit } from 'easy-react-form'

import SendPlaneIcon from 'frontend-lib/icons/send-plane-fill.svg'

import useMessages from '../hooks/useMessages.js'

import './PostForm.css'

function PostForm({
	initialContent,
	onCancel,
	onSubmit
}, ref) {
	const messages = useMessages()
	return (
		<Form
			ref={ref}
			autoFocus
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
				className="form__component PostForm-textInput"/>
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
				<SendPlaneIcon className="PostForm-actionIcon"/>
			</Submit>
		</Form>
	)
}

PostForm = React.forwardRef(PostForm)

PostForm.propTypes = {
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
	initialContent: PropTypes.string
}

export default PostForm