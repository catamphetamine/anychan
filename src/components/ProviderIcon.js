import React from 'react'

import { getProvider } from '../provider'

export default function ProviderIcon(props) {
	return (
		<img {...props} src={getProvider().icon}/>
	)
}