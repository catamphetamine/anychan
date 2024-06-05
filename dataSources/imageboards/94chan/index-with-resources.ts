import type { ImageboardDataSourceDefinitionWithResources } from '@/types'

import Properties from './index.js'

import Icon from './resources/icon.png'
import Logo from './resources/logo.svg'

const dataSource: ImageboardDataSourceDefinitionWithResources = {
	...Properties,
	icon: Icon,
	logo: Logo
}

export default dataSource