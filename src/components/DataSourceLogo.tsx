import type { DataSource } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'

import { dataSource } from '../PropTypes.js'

// CSS `color: black`.
// import DefaultLogo from '../../assets/images/icon/icon.svg'

export default function DataSourceLogo({
	dataSource,
	className,
	...rest
}: DataSourceLogoProps) {
	if (!hasLogo(dataSource)) {
		return null
	}

	const Logo = dataSource.logo

	// if (!Logo) {
	// 	return (
	// 		<DefaultLogo {...rest}/>
	// 	)
	// }

	if (typeof Logo === 'string') {
		return (
			<img {...rest} className={className} src={Logo}/>
		)
	}

	return (
		<Logo {...rest} className={className}/>
	)
}

DataSourceLogo.propTypes = {
	dataSource: dataSource.isRequired,
	className: PropTypes.string
}

interface DataSourceLogoProps {
	dataSource: DataSource,
	className?: string
}

export function hasLogo(dataSource: DataSource) {
	return dataSource.logo !== undefined
}