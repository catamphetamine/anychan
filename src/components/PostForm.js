import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { TextInput, Button } from 'react-responsive-ui'
import { Form, Field, Submit } from 'easy-react-form'

import SendPlaneIcon from 'webapp-frontend/assets/images/icons/send-plane-fill.svg'

import getMessages from '../messages'

import './PostForm.css'

function PostForm({
	initialContent,
	onCancel,
	onSubmit
}, ref) {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	return (
		<Form
			ref={ref}
			autoFocus
			requiredMessage={getMessages(locale).form.error.required}
			onSubmit={onSubmit}
			className="PostForm form">
			<Field
				required
				name="content"
				component={TextInput}
				multiline
				rows={1}
				placeholder={getMessages(locale).post.form.inputText}
				value={initialContent}
				className="form__component PostForm-textInput"/>
			{onCancel &&
				<Button
					onClick={onCancel}
					className="PostForm-action">
					{getMessages(locale).actions.cancel}
				</Button>
			}
			<Submit
				component={Button}
				type="submit"
				title={getMessages(locale).actions.post}
				className="PostForm-action">
				<SendPlaneIcon className="PostForm-actionIcon"/>
			</Submit>
		</Form>
	)
}

PostForm = React.forwardRef(PostForm)

PostForm.propTypes = {
	locale: PropTypes.string.isRequired,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
	initialContent: PropTypes.string
}

export default PostForm