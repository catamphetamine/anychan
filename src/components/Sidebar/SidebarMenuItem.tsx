import React, { ElementType } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Link } from 'react-pages'
import Button from 'frontend-lib/components/Button.js'

import 'frontend-lib/components/Button.css'

import './SidebarMenuItem.css'

export default function SidebarMenuItem({
	selected,
	onClick,
	link,
	label,
	showLabel,
	IconComponent,
	className
}: SidebarMenuItemProps) {
	let Component
	let props

	if (link) {
		Component = Link
		props = {
			to: link
		}
	} else {
		Component = Button
		props = {
			onClick
		}
	}

	return (
		// @ts-expect-error
		<Component
			{...props}
			title={showLabel ? undefined : label}
			className={classNames(className, 'SidebarMenuItem', {
				'SidebarMenuItem--withLabel': showLabel,
				'SidebarMenuItem--icon': !showLabel,
				'SidebarMenuItem--selected': selected
			})}>
			<IconComponent className="SidebarMenuItem-icon"/>
			{showLabel &&
				<span className="SidebarMenuItem-label">
					{label}
				</span>
			}
		</Component>
	)
}

SidebarMenuItem.propTypes = {
	onClick: PropTypes.func,
	link: PropTypes.string,
	label: PropTypes.string.isRequired,
	showLabel: PropTypes.bool,
	selected: PropTypes.bool,
	IconComponent: PropTypes.elementType.isRequired,
	className: PropTypes.string
}

interface SidebarMenuItemProps {
	onClick?: () => void,
	link?: string,
	label: string,
	showLabel?: boolean,
	selected?: boolean,
	IconComponent: ElementType
	className?: string
}