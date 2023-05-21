import React from 'react'
import { useLoading } from 'react-pages'
import { useSelector } from 'react-redux'

import PageLoading from './PageLoading.js'

export default function PageLoadingIndicator() {
	const isLoading = useLoading()
	return (
		<PageLoading show={isLoading}/>
	)
}