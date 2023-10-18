import React from 'react'
import PropTypes from 'prop-types'

import TextInput from './fields/TextInput.js'
import Select from './fields/Select.js'
import Autocomplete from './fields/Autocomplete.js'

import { Field as Field_ } from 'frontend-lib/components/Form.js'

const Field = React.forwardRef(({
	type,
	component,
	...rest
}, ref) => {
	switch (type) {
		case 'autocomplete':
			component = Autocomplete
			break
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
		'autocomplete',
		'text',
		'select'
	]),
	component: PropTypes.elementType
}

export default Field