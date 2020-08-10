import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { TextInput, Button } from 'react-responsive-ui'
import { Form, Field, Submit } from 'easy-react-form'

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
			className="PostForm">
			<Field
				required
				name="content"
				component={TextInput}
				multiline
				value={initialContent}/>
			<div>
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
					className="PostForm-action">
					{getMessages(locale).actions.post}
				</Submit>
			</div>
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