import React from 'react'
import PropTypes from 'prop-types'

import TextInput from './fields/TextInput.js'
import Select from './fields/Select.js'

import { Field as Field_ } from 'frontend-lib/components/Form.js'

const Field = React.forwardRef(({
	wait,
	type,
	options,
	...rest
}, ref) => {
	let component
	switch (type) {
		case 'text':
			component = TextInput
			break
		case 'select':
			component = Select
			break
		default:
			// throw new Error(`Unsupported <Field/> type: "${type}"`)
			break
	}

	return (
		<Field_
			ref={ref}
			{...rest}
			component={component}
		/>
	)
})

Field.propTypes = {
	type: PropTypes.oneOf([
		'text',
		'select'
	]),
	options: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.any,
		label: PropTypes.string.isRequired
	}))
}

export default Field