import type { DataSource } from '@/types'

import IMAGEBOARDS from './imageboards/index.js'
import NON_IMAGEBOARDS from './non-imageboards.js'

// import SomeNonImageboardDATASourceLikeReddit from './some-none-imageboard-data-source-like-reddit'

// For each non-imageboard data source, add utility functions.
for (const dataSource of (NON_IMAGEBOARDS as NonImageboardDataSourceConfig[])) {
	dataSource.supportsCreateThread = () => true
	dataSource.supportsCreateComment = () => true
	dataSource.supportsReportComment = () => true
	dataSource.supportsLogIn = () => true
	dataSource.supportsVote = () => true
	dataSource.supportsGetCaptcha = () => true

	dataSource.hasLogInTokenPassword = () => false
}

export default NON_IMAGEBOARDS.concat(IMAGEBOARDS) as DataSource[]

type DataSourcePropertiesThatWillBeSetInThisCode =
	'supportsCreateThread' |
	'supportsCreateComment' |
	'supportsReportComment' |
	'supportsLogIn' |
	'supportsVote' |
	'supportsGetCaptcha' |
	'hasLogInTokenPassword'

export type NonImageboardDataSourceConfig = Omit<DataSource,
	DataSourcePropertiesThatWillBeSetInThisCode |
	'icon' |
	'logo' |
	'manifestUrl'
> & Partial<Pick<DataSource, DataSourcePropertiesThatWillBeSetInThisCode>>