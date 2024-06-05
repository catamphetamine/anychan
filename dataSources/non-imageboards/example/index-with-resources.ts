import type { DataSourceDefinitionWithResources } from '@/types'

import Properties from './index.js'

import Icon from './resources/icon.png'
import Logo from './resources/logo.png'

const dataSource: DataSourceDefinitionWithResources = {
	...Properties,
	icon: Icon,
	logo: Logo
}

export default dataSource