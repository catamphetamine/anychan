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
				dataSource={dataSource}
				className="ChannelThreadHeader-dataSourceLogo"
			/>
		</Link>
	)
}

export function ChannelThreadHeaderSourcePlaceholder() {
	const dataSource = useDataSource()
	return (
		<DataSourceLogo
			dataSource={dataSource}
			className="ChannelThreadHeader-dataSourceLogo ChannelThreadHeader-dataSourceLogo--spaceEquivalent"
		/>
	)
}