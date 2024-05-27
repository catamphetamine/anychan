import type { ReactNode } from 'react'
import type { InferProps } from 'prop-types'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button_ from 'frontend-lib/components/ButtonAsync.js'

import './ButtonStyled.css'

const ButtonStyled = React.forwardRef<HTMLButtonElement, ButtonStyledProps>(({
	style,
	...rest
}, ref) => (
	<Button_
		ref={ref}
		style={style}
		{...rest}
	/>
))

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

type ButtonStyledProps = {
	style?: ButtonStyleName | ButtonStyleObject,
} & InferProps<typeof Button_.propTypes>

type ButtonStyleName =
	'text' |
	'text-multiline' |
	'text-custom-height' |
	'fill' |
	'outline'

type ButtonStyleObject = object

export default ButtonStyled