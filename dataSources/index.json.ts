import { DataSource } from '@/types'

import IMAGEBOARDS from './imageboards/index.json.js'
import NON_IMAGEBOARDS from './non-imageboards/index.json.js'

// I dunno what that giant error message means.
// @ts-expect-error
const DATA_SOURCES: DataSourceInfo[] = NON_IMAGEBOARDS.concat(IMAGEBOARDS).map((dataSourceInfo) => ({
	...dataSourceInfo,
	imageboard: IMAGEBOARDS.includes(dataSourceInfo)
}))

export default DATA_SOURCES

// These properties are read in `./webpack/HtmlPlugin.js`.
type DataSourceInfo = Pick<DataSource,
	'id' |
	'shortId' |
	'title' |
	'aliases'
> & {
	imageboard: boolean
}