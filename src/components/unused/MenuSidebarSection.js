import React from 'react'
import { useSelector } from 'react-redux'

import SidebarSection from '../Sidebar/SidebarSection.js'
import SidebarMenu from '../SidebarMenu/SidebarMenu.js'

import useMessages from '../../hooks/useMessages.js'

// This component is not used.

// className="SidebarSection--smallScreen"
//
// @mixin l-plus {
// 	.SidebarSection--smallScreen {
// 		display: none;
// 	}
// }

export default function ToolbarSidebarSection() {
	const messages = useMessages()

	return (
		<SidebarSection title={messages.menu}>
			<SidebarMenu/>
		</SidebarSection>
	)
}