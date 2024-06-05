import type { Content, ImageboardDataSourceDefinition } from '@/types'

import config from './index.json' assert { type: 'json' }

const imageboard: ImageboardDataSourceDefinition = {
	...config
}

export default imageboard