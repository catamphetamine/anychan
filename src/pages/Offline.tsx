import type { PageMetaFunction } from '@/types'

import React from 'react'

import useMessages from '../hooks/useMessages.js'

import ErrorPage from './Error.js'

// import './Offline.css'

export default function Offline() {
	return <ErrorPage status={503}/>
}

const meta: PageMetaFunction = ({ useSelector }) => {
	const messages = useMessages({ useSelector })
	return {
		title: messages.errorPages['503'].title
	}
}

Offline.meta = meta