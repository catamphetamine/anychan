import React from 'react'
import PropTypes from 'prop-types'

import ButtonStyled from './ButtonStyled.js'

let TextButton = ({ multiline, ...props }, ref) => {
	return (
		<ButtonStyled
			{...props}
			ref={ref}
			style={multiline ? "text-multiline" : "text"}
		/>
	)
}

TextButton = React.forwardRef(TextButton)

TextButton.propTypes = {
	multiline: PropTypes.bool
}

export default TextButton