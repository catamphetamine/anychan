import React from 'react'
import { useSelector } from 'react-redux'

import SidebarSection from '../Sidebar/SidebarSection.js'
import SidebarMenu from './SidebarMenu.js'

import useMessages from '../../hooks/useMessages.js'

export default function SidebarMenuSection() {
	const messages = useMessages()
	return (
		<SidebarSection
			title={messages.menu}
			className="SidebarSection--smallScreen">
			<SidebarMenu/>
		</SidebarSection>
	)
}