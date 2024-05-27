import type { InferProps } from 'prop-types'

import React from 'react'
import PropTypes from 'prop-types'

import TextInput from './fields/TextInput.js'
import Select from './fields/Select.js'
import Autocomplete from './fields/Autocomplete.js'

import { Field as Field_ } from 'frontend-lib/components/Form.js'

const Field = React.forwardRef(({
	type,
	component,
	inputType,
	...rest
}: FieldProps, ref) => {
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
			type={inputType}
			component={component}
		/>
	)
})

Field.propTypes = {
	...Field_.propTypes,
	type: PropTypes.oneOf([
		'autocomplete',
		'text',
		'select'
	]),
	inputType: PropTypes.string,
	component: PropTypes.elementType
}

type FieldProps = {
	type: FieldType,
	inputType?: string
	component?: React.ElementType
} & InferProps<typeof Field_.propTypes>

type FieldType =
	'autocomplete' |
	'text' |
	'select'

export default Field