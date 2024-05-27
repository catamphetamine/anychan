import type { PageMetaFunction } from '@/types'

import React from 'react'

import useMessages from '../hooks/useMessages.js'

import ErrorPage from './Error.js'

// import './NotFound.css'

export default function NotFound() {
	return <ErrorPage status={404}/>
}

const meta: PageMetaFunction = ({ useSelector }) => {
	const messages = useMessages({ useSelector })
	return {
		title: messages.errorPages['404'].title
	}
}

NotFound.meta = meta