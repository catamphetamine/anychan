import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button_ from 'frontend-lib/components/ButtonAsync.js'

import './ButtonStyled.css'

let ButtonStyled = ({
	...rest
}, ref) => (
	<Button_
		ref={ref}
		{...rest}
	/>
)

ButtonStyled = React.forwardRef(ButtonStyled)

ButtonStyled.propTypes = {
	style: PropTypes.oneOfType([
		PropTypes.oneOf([
			'text',
			'text-multiline',
			'text-custom-height',
			'fill',
			'outline'
		]),
		// Sometimes, components like `<PostAttachmentThumbnail/>`
		// pass a custom `style` object that can't be replaced with a `className`.
		// Example: `{ width: 222px, height: 150px }`.
		PropTypes.object
	])
}

export default ButtonStyled