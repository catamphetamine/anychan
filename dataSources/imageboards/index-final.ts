import IMAGEBOARD_DATA_SOURCES from './index.js'

import addImageboardDataSourceProperties from '../../src/utility/dataSource/addImageboardDataSourceProperties.js'

export default IMAGEBOARD_DATA_SOURCES.map(addImageboardDataSourceProperties)