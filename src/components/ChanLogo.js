import React from 'react'

// CSS `color: black`.
// import DefaultLogo from '../../assets/images/icon.svg'

import { getChan } from '../chan'

export default function ChanLogo(props) {
	const Logo = getChan().logo
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
	return getChan().logo !== undefined
}