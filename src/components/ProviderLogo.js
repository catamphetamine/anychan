import React from 'react'

// CSS `color: black`.
// import DefaultLogo from '../../assets/images/icon/icon.svg'

import { getProvider } from '../provider.js'

export default function ProviderLogo(props) {
	const Logo = getProvider().logo
	// if (!Logo) {
	// 	return (
	// 		<DefaultLogo {...props}/>
	// 	)
	// }
	if (typeof Logo === 'string') {
		return (
			<img {...props} src={Logo}/>
		)
	}
	return (
		<Logo {...props}/>
	)
}

export function hasLogo() {
	return getProvider().logo !== undefined
}