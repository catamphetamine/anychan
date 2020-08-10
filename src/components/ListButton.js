import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from 'webapp-frontend/src/components/Button'

import RemoveIcon from 'webapp-frontend/assets/images/icons/close-thicker.svg'

import './ListButton.css'

function ListButton({
	onClick,
	title,
	icon,
	muted,
	className
}, ref) {
	const Icon = getIcon(icon)
	return (
		<Button
			ref={ref}
			onClick={onClick}
			title={title}
			className={classNames(className, 'ListButton', {
				'ListButton--muted': muted
			})}>
			<div className="ListButton-background">
				<Icon className="ListButton-icon"/>
			</div>
		</Button>
	)
}

ListButton = React.forwardRef(ListButton)

ListButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	icon: PropTypes.oneOfType(['remove']).isRequired,
	muted: PropTypes.bool,
	className: PropTypes.string
}

export default ListButton

function getIcon(icon) {
	switch (icon) {
		case 'remove':
			return RemoveIcon
	}
}