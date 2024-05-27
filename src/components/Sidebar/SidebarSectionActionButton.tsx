import React, { ElementType } from 'react'
import PropTypes from 'prop-types'

import Button from 'frontend-lib/components/ButtonAsync.js'
// import PressedStateButton from 'social-components-react/components/PressedStateButton.js'

import './SidebarSectionActionButton.css'

const SidebarSectionActionButton = React.forwardRef<HTMLButtonElement, SidebarSectionActionButtonProps>(({
	title,
	onClick,
	Icon
}, ref) => {
	// const isPressed = false
	// return (
	// 	<PressedStateButton
	// 		ref={ref}
	// 		title={title}
	// 		onClick={onClick}
	// 		aria-pressed={isPressed}
	// 		className={classNames('SidebarSectionMoreButton', 'SidebarButton', {
	// 			'SidebarButton--pressed': isPressed,
	// 			'SidebarButton--unpressed': !isPressed
	// 		})}>
	// 		<Icon className="SidebarSectionActionButton-icon"/>
	// 	</PressedStateButton>
	// )

	return (
		<Button
			ref={ref}
			onClick={onClick}
			title={title}
			className="SidebarSectionActionButton">
			<Icon className="SidebarSectionActionButton-icon"/>
		</Button>
	)
})

SidebarSectionActionButton.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	// @ts-ignore
	Icon: PropTypes.elementType.isRequired
}

interface SidebarSectionActionButtonProps {
	title: string,
	onClick: () => void,
	Icon: ElementType
}

export default SidebarSectionActionButton