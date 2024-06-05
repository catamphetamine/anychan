import type { DataSourceWithoutResources, ImageboardDataSourceDefinition } from '@/types'

import IMAGEBOARDS from './imageboards/index-final.js'
import NON_IMAGEBOARDS from './non-imageboards/index.js'

import addDataSourceProperties from '../src/utility/dataSource/addDataSourceProperties.js'
import validateDataSourceShortIdUniqueness from '../src/utility/dataSource/validateDataSourceShortIdUniqueness.js'

const ALL_DATA_SOURCES: DataSourceWithoutResources[] = NON_IMAGEBOARDS.concat(IMAGEBOARDS) as DataSourceWithoutResources[]
export default ALL_DATA_SOURCES

addDataSourceProperties(ALL_DATA_SOURCES)
validateDataSourceShortIdUniqueness(ALL_DATA_SOURCES)