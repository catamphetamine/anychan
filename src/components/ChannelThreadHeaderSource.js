import React from 'react'
import { Link } from 'react-pages'

import ProviderLogo from './ProviderLogo.js'

import { getProvider } from '../provider.js'

import './ChannelThreadHeaderSource.css'

export default function ChannelThreadHeaderSource() {
	return (
		<Link
			to="/"
			title={getProvider().title}
			className="ChannelThreadHeader-providerLogoLink">
			<ProviderLogo
				className="ChannelThreadHeader-providerLogo"
			/>
		</Link>
	)
}

export function ChannelThreadHeaderSourcePlaceholder() {
	return (
		<ProviderLogo
			className="ChannelThreadHeader-providerLogo ChannelThreadHeader-providerLogo--spaceEquivalent"
		/>
	)
}