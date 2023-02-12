import React, { useMemo } from 'react'

import SidebarSection from '../Sidebar/SidebarSection.js'
import ProviderLogo from '../ProviderLogo.js'

import useMessages from '../../hooks/useMessages.js'

import getBasePath from '../../utility/getBasePath.js'

import PROVIDERS_LIST from '../../../providers/index.js'

import './SourcesSidebarSection.css'

export default function SourcesSidebarSection() {
	const messages = useMessages()

	const sources = useMemo(() => {
		// `arisuchan.jp` website has been taken down.
		// There's `legacy.arisuchan.jp` website but it doesn't provide the `*.json` files.
		// Example:
		// * https://legacy.arisuchan.jp/tech/res/2867.html
		// * https://legacy.arisuchan.jp/tech/res/2867.json
		return PROVIDERS_LIST.filter(_ => _.id !== 'arisuchan')
	}, [])

	return (
		<SidebarSection title={messages.sources.title}>
			{sources.map((provider) => (
				<a
					key={provider.id}
					href={getBasePath({ providerId: provider.id })}
					className="SourcesSidebarSection-source">
					<ProviderLogo
						provider={provider}
						className="SourcesSidebarSection-sourceLogo"
					/>
					{provider.title}
				</a>
			))}
		</SidebarSection>
	)
}