import React from 'react'
import { Link } from 'react-pages'

import DataSourceLogo from '../DataSourceLogo.js'

import useDataSource from '../../hooks/useDataSource.js'

import './SidebarDataSourceLogo.css'

export default function SidebarDataSourceLogo() {
	const dataSource = useDataSource()

	if (!dataSource) {
		return null
	}

	return (
		<div className="SidebarDataSourceLogo">
			<Link
				to="/"
				className="SidebarDataSourceLogo-link">
				<DataSourceLogo
					aria-hidden
					dataSource={dataSource}
					className="SidebarDataSourceLogo-image"
				/>
				{dataSource.title}
				<DataSourceLogo
					aria-hidden
					dataSource={dataSource}
					className="SidebarDataSourceLogo-image SidebarDataSourceLogo-image--placeholder"
				/>
			</Link>
		</div>
	)
}