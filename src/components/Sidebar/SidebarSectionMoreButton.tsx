import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PressedStateButton from 'social-components-react/components/PressedStateButton.js'

import EllipsisIcon from 'frontend-lib/icons/ellipsis.svg'

import './SidebarSectionMoreButton.css'

const SidebarSectionMoreButton = React.forwardRef<HTMLButtonElement, SidebarSectionMoreButtonProps>(({
	title,
	onClick
}, ref) => {
	const [isPressed, setPressed] = useState(false)

	const onClick_ = useCallback(() => {
		const setPressedState = () => setPressed(!isPressed)
		const result = onClick(!isPressed)
		if (result && typeof result.then === 'function') {
			return result.then(setPressedState)
		} else {
			setPressedState()
		}
	}, [isPressed, onClick])

	return (
		<PressedStateButton
			ref={ref}
			title={title}
			onClick={onClick_}
			pressed={isPressed}
			aria-pressed={isPressed}
			className={classNames('SidebarSectionMoreButton', 'SidebarButton', {
				'SidebarButton--pressed': isPressed,
				'SidebarButton--unpressed': !isPressed
			})}>
			<EllipsisIcon className="SidebarSectionMoreButton-icon"/>
		</PressedStateButton>
	)
})

SidebarSectionMoreButton.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
}

interface SidebarSectionMoreButtonProps {
	title: string,
	onClick: (isPressed: boolean) => void | Promise<void>
}

export default SidebarSectionMoreButton