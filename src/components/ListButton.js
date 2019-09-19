import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import RemoveIcon from 'webapp-frontend/assets/images/icons/close-thicker.svg'

import './ListButton.css'

export default function ListButton({
	onClick,
	title,
	icon,
	muted,
	className
}) {
	const Icon = getIcon(icon)
	return (
		<button
			type="button"
			onClick={onClick}
			title={title}
			className={classNames(className, 'rrui__button-reset', 'ListButton', {
				'ListButton--muted': muted
			})}>
			<div className="ListButton__background">
				<Icon className="ListButton__icon"/>
			</div>
		</button>
	)
}

ListButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	icon: PropTypes.oneOfType(['remove']).isRequired,
	muted: PropTypes.bool,
	className: PropTypes.string
}

function getIcon(icon) {
	switch (icon) {
		case 'remove':
			return RemoveIcon
	}
}