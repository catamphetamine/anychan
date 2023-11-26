import React, { useMemo } from 'react'
import classNames from 'classnames'

import SidebarSection from '../Sidebar/SidebarSection.js'
import DataSourceLogo from '../DataSourceLogo.js'

import useMessages from '../../hooks/useMessages.js'
import useDataSource from '../../hooks/useDataSource.js'

import getBasePath from '../../utility/getBasePath.js'

import SOURCES_LIST from '../../../dataSources/index.js'

import './DataSourcesSidebarSection.css'

export default function DataSourcesSidebarSection() {
	const messages = useMessages()

	const currentDataSource = useDataSource()

	const dataSources = useMemo(() => {
		// `arisuchan.jp` website has been taken down.
		// There's `legacy.arisuchan.jp` website but it doesn't provide the `*.json` files.
		// Example:
		// * https://legacy.arisuchan.jp/tech/res/2867.html
		// * https://legacy.arisuchan.jp/tech/res/2867.json
		return SOURCES_LIST.filter(_ => _.id !== 'arisuchan')
	}, [])

	return (
		<SidebarSection title={messages.sources.title}>
			{dataSources.map((dataSource) => (
				<a
					key={dataSource.id}
					href={getBasePath({ dataSource })}
					className={classNames('DataSourcesSidebarSection-dataSource', {
						'DataSourcesSidebarSection-dataSource--selected': currentDataSource && dataSource.id === currentDataSource.id
					})}>
					<DataSourceLogo
						dataSource={dataSource}
						className="DataSourcesSidebarSection-dataSourceLogo"
					/>
					{dataSource.title}
				</a>
			))}
		</SidebarSection>
	)
}