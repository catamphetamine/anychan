import React from 'react'
import { useSelector } from 'react-redux'

import SidebarSection from './SidebarSection'
import SidebarMenu from './SidebarMenu'

import getMessages from '../../messages'

export default function SidebarMenuSection() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	return (
		<SidebarSection title={getMessages(locale).menu} className="SidebarSection--smallScreen">
			<SidebarMenu/>
		</SidebarSection>
	)
}