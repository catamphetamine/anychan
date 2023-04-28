import React from 'react'
import { Link } from 'react-pages'

import DataSourceLogo from './DataSourceLogo.js'

import useDataSource from '../hooks/useDataSource.js'

import './ChannelThreadHeaderSource.css'

export default function ChannelThreadHeaderSource() {
	const dataSource = useDataSource()
	return (
		<Link
			to="/"
			title={dataSource.title}
			className="ChannelThreadHeader-dataSourceLogoLink">
			<DataSourceLogo
				className="ChannelThreadHeader-dataSourceLogo"
			/>
		</Link>
	)
}

export function ChannelThreadHeaderSourcePlaceholder() {
	return (
		<DataSourceLogo
			className="ChannelThreadHeader-dataSourceLogo ChannelThreadHeader-dataSourceLogo--spaceEquivalent"
		/>
	)
}