import React from 'react'

import { provider } from '../PropTypes.js'

// CSS `color: black`.
// import DefaultLogo from '../../assets/images/icon/icon.svg'

import { getProvider } from '../provider.js'

export default function ProviderLogo({
	provider = getProvider(),
	...rest
}) {
	if (!hasLogo(provider)) {
		return null
	}

	const Logo = provider.logo

	// if (!Logo) {
	// 	return (
	// 		<DefaultLogo {...rest}/>
	// 	)
	// }

	if (typeof Logo === 'string') {
		return (
			<img {...rest} src={Logo}/>
		)
	}

	return (
		<Logo {...rest}/>
	)
}

ProviderLogo.propTypes = {
	provider: provider
}

export function hasLogo(provider) {
	return provider.logo !== undefined
}