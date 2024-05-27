import type { InferProps } from 'prop-types'

import React from 'react'
import PropTypes from 'prop-types'

import { useLoading } from 'react-pages'
import { useSelector } from '@/hooks'

import PageLoading from './PageLoading.js'

export default function PageLoadingIndicator({
	show
}: InferProps<typeof PageLoadingIndicator.propTypes>) {
	const isLoading = useLoading()
	const showPageLoadingIndicator = useSelector(state => state.app.showPageLoadingIndicator)
	return (
		<PageLoading show={isLoading || showPageLoadingIndicator}/>
	)
}

PageLoadingIndicator.propTypes = {
	show: PropTypes.bool
}