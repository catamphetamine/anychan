import React from 'react'

import { getChan } from '../chan'

export default function ChanIcon(props) {
	return (
		<img {...props} src={getChan().icon}/>
	)
}