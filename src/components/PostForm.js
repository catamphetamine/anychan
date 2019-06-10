import React from 'react'
import PropTypes from 'prop-types'
import { TextInput, Button } from 'react-responsive-ui'
import { Form, Field, Submit } from 'easy-react-form'

import getMessages from '../messages'

import './PostForm.css'

export default class PostForm extends React.Component {
	static propTypes = {
		locale: PropTypes.string.isRequired,
		onCancel: PropTypes.func,
		onSubmit: PropTypes.func.isRequired,
		initialContent: PropTypes.string
	}

	form = React.createRef()

	focus = () => this.form.current.focus()

	render() {
		const {
			locale,
			initialContent,
			onCancel,
			onSubmit
		} = this.props
		return (
			<Form
				ref={this.form}
				autoFocus
				requiredMessage={getMessages(locale).form.error.required}
				onSubmit={onSubmit}
				className="post-form">
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
							className="post-form__action">
							{getMessages(locale).actions.cancel}
						</Button>
					}
					<Submit
						component={Button}
						type="submit"
						className="post-form__action">
						{getMessages(locale).actions.post}
					</Submit>
				</div>
			</Form>
		)
		return null
	}
}