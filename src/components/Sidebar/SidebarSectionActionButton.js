import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from 'frontend-lib/components/ButtonAsync.js'
// import PressedStateButton from 'social-components-react/components/PressedStateButton.js'

import './SidebarSectionActionButton.css'

const SidebarSectionActionButton = React.forwardRef(({
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
			className="SidebarSectionActionButton">
			<Icon className="SidebarSectionActionButton-icon"/>
		</Button>
	)
})

SidebarSectionActionButton.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	Icon: PropTypes.elementType.isRequired
}

export default SidebarSectionActionButton