import React from 'react'
import { Link } from 'react-pages'

import ProviderLogo from '../ProviderLogo'

import { getProvider } from '../../provider'

import './SidebarProviderLogo.css'

export default function SidebarProviderLogo() {
	if (!getProvider()) {
		return null
	}
	return (
		<div className="Sidebar-providerLogo">
			<Link
				to="/"
				className="Sidebar-providerLink">
				<ProviderLogo
					aria-hidden
					className="Sidebar-providerLogoImage"/>
				{getProvider().title}
				<ProviderLogo
					aria-hidden
					className="Sidebar-providerLogoImage Sidebar-providerLogoImage--spaceEquivalent"/>
			</Link>
		</div>
	)
}