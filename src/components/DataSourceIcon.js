import React from 'react'

import useDataSource from '../hooks/useDataSource.js'

export default function DataSourceIcon(props) {
	const dataSource = useDataSource()
	return (
		<img {...props} src={dataSource.icon}/>
	)
}