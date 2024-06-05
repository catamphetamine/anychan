import type { DataSource } from '@/types'

import IMAGEBOARDS from './imageboards/index-with-resources-final.js'
import NON_IMAGEBOARDS from './non-imageboards/index-with-resources.js'

import addDataSourceProperties from '../src/utility/dataSource/addDataSourceProperties.js'
import validateDataSourceShortIdUniqueness from '../src/utility/dataSource/validateDataSourceShortIdUniqueness.js'

const ALL_DATA_SOURCES = NON_IMAGEBOARDS.concat(IMAGEBOARDS) as DataSource[]
export default ALL_DATA_SOURCES

addDataSourceProperties(ALL_DATA_SOURCES)
validateDataSourceShortIdUniqueness(ALL_DATA_SOURCES)