import * as React from 'react'

import DATA_SOURCES_LIST from '../../../dataSources/index.js'

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
				{DATA_SOURCES_LIST.map((dataSource) => (
					<li key={dataSource.id} className="NoDataSourcePage-dataSource">
						<a href={'/' + dataSource.id}>
							{dataSource.id}
						</a>
					</li>
				))}
			</ul>
		</section>
	)
}