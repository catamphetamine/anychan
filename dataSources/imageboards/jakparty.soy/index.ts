import type { Content, ImageboardDataSourceDefinition } from '@/types'

import config from './index.json' assert { type: 'json' }

const imageboard: ImageboardDataSourceDefinition = {
	...config,
	description: config.description as Content
}

export default imageboard