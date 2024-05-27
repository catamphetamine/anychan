import type { InferProps } from 'prop-types'

import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'

import ButtonStyled from './ButtonStyled.js'

const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(({
	multiline,
	customHeight,
	children,
	...props
}, ref) => {
	return (
		<ButtonStyled
			{...props}
			ref={ref}
			style={multiline ? 'text-multiline' : (customHeight ? 'text-custom-height' : 'text')}
		>
			{children}
		</ButtonStyled>
	)
})

TextButton.propTypes = {
	multiline: PropTypes.bool,
	customHeight: PropTypes.bool,
	children: PropTypes.node.isRequired
}

type TextButtonProps = {
	multiline?: boolean,
	customHeight?: boolean,
	children: ReactNode
} & InferProps<typeof ButtonStyled.propTypes>

export default TextButton
