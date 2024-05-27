import * as React from 'react'

import DATA_SOURCES_LIST from '../../../dataSources/index.js'

import DataSourceLogo from '../../components/DataSourceLogo.js'

import getDataSourceLinkUrl from '@/utility/dataSource/getDataSourceBasePath.js'

import './NoDataSource.css'

export default function NoDataSourcePage() {
	return (
		<section className="Content Content--text">
			<h1 className="NoDataSourcePage-title">
				No Data Source
			</h1>

			<p>
				No <code className="NoDataSourcePage-code">dataSource</code> parameter was specified in the configuration, and no data source ID was found in the URL <code className="NoDataSourcePage-url">{location.pathname}</code>
			</p>

			<p>Available data sources:</p>

			<ul className="NoDataSourcePage-dataSources">
				{DATA_SOURCES_LIST.filter(_ => !_.hidden).map((dataSource) => (
					<li key={dataSource.id} className="NoDataSourcePage-dataSource">
						<a href={getDataSourceLinkUrl(dataSource)}>
							<DataSourceLogo dataSource={dataSource} className="NoDataSourcePage-dataSourceLogo"/>
							{dataSource.id}
						</a>
					</li>
				))}
			</ul>
		</section>
	)
}