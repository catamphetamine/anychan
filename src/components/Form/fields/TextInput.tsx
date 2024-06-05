import type { InferProps } from 'prop-types'

import React from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error
import { TextInput } from 'react-responsive-ui'

const TextInputComponent = React.forwardRef<HTMLInputElement, TextInputComponentProps>(({
	wait,
	...rest
}, ref) => {
	return (
		<TextInput
			ref={ref}
			readOnly={wait}
			{...rest}
		/>
	)
})

TextInputComponent.propTypes = {
	wait: PropTypes.bool
}

type TextInputComponentProps = {
	wait?: boolean
} & InferProps<typeof TextInput.propTypes>

export default TextInputComponent