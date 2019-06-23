import React from 'react'

import DefaultLogo from '../../assets/images/icon@192x192.png'

import { getChan } from '../chan'

export default function ChanLogo(props) {
	const Logo = getChan().logo
	if (typeof Logo === 'string') {
		return (
			<img {...props} src={Logo}/>
		)
	}
	return (
		<Logo {...props}/>
	)
}