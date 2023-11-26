import React from 'react'
import PropTypes from 'prop-types'

import ButtonStyled from './ButtonStyled.js'

let TextButton = ({ multiline, customHeight, ...props }, ref) => {
	return (
		<ButtonStyled
			{...props}
			ref={ref}
			style={multiline ? 'text-multiline' : (customHeight ? 'text-custom-height' : 'text')}
		/>
	)
}

TextButton = React.forwardRef(TextButton)

TextButton.propTypes = {
	multiline: PropTypes.bool,
	customHeight: PropTypes.bool
}

export default TextButton