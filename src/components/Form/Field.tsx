import type { InferProps } from 'prop-types'

import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import TextInput from './fields/TextInput.js'
import TextInputColor, { isValidColor } from './fields/TextInputColor.js'
import Select from './fields/Select.js'
import Autocomplete from './fields/Autocomplete.js'

import { Field as Field_ } from 'frontend-lib/components/Form.js'

import { useMessages } from '@/hooks'

const Field = React.forwardRef(({
	type,
	component,
	inputType,
	validate,
	...rest
}: FieldProps, ref) => {
	const messages = useMessages()

	let isValid: (value?: any) => boolean

	switch (type) {
		case 'autocomplete':
			component = Autocomplete
			break
		case 'color':
			component = TextInputColor
			isValid = isValidColor
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

	const validateDefault = useCallback((value: string) => {
		if (!isValid(value)) {
			return messages.form.error.invalid
		}
	}, [
		isValid,
		messages
	])

	return (
		<Field_
			ref={ref}
			validate={validate || (isValid && validateDefault)}
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
		'color',
		'text',
		'select'
	] as const),
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
	'color' |
	'text' |
	'select'

export default Field