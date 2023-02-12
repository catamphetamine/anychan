import React from 'react'
import { Link } from 'react-pages'

import ProviderLogo from '../ProviderLogo.js'

import { getProvider } from '../../provider.js'

import './SidebarProviderLogo.css'

export default function SidebarProviderLogo() {
	if (!getProvider()) {
		return null
	}

	return (
		<div className="SidebarProviderLogo">
			<Link
				to="/"
				className="SidebarProviderLogo-link">
				<ProviderLogo
					aria-hidden
					className="SidebarProviderLogo-image"
				/>
				{getProvider().title}
				<ProviderLogo
					aria-hidden
					className="SidebarProviderLogo-image SidebarProviderLogo-image--placeholder"
				/>
			</Link>
		</div>
	)
}