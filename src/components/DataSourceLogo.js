import React from 'react'

import useDataSource from '../hooks/useDataSource.js'

import { dataSource } from '../PropTypes.js'

// CSS `color: black`.
// import DefaultLogo from '../../assets/images/icon/icon.svg'

export default function DataSourceLogo({
	dataSource,
	...rest
}) {
	const currentDataSource = useDataSource()

	if (!dataSource) {
		dataSource = currentDataSource
	}

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
			<img {...rest} src={Logo}/>
		)
	}

	return (
		<Logo {...rest}/>
	)
}

DataSourceLogo.propTypes = {
	dataSource: dataSource
}

export function hasLogo(dataSource) {
	return dataSource.logo !== undefined
}