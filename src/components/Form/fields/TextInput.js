import React from 'react'
import PropTypes from 'prop-types'

import { TextInput } from 'react-responsive-ui'

const TextInputComponent = React.forwardRef(({
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

export default TextInputComponent