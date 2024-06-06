import type { ChannelFromDataSource, ThreadFromDataSource, CommentFromDataSource } from '@/types'

import { CHANNEL1_THREAD1 } from './thread1/index.js'
import { CHANNEL1_THREAD2 } from './thread2/index.js'

// Having this export in a separate file prevents "circular dependency"
// from thread `index.ts` files to the channel `index.ts` file.
import CHANNEL1_INFO from './index.json' assert { type: 'json' }

export { CHANNEL1_THREAD1 } from './thread1/index.js'
export { CHANNEL1_THREAD2 } from './thread2/index.js'

const CHANNEL1_ID = CHANNEL1_INFO.id
const CHANNEL1_TITLE = CHANNEL1_INFO.title

export const CHANNEL1: ChannelFromDataSource & {
	threads: ThreadFromDataSource[]
} = {
	id: CHANNEL1_ID,
	title: CHANNEL1_TITLE,
	threads: [
		CHANNEL1_THREAD1,
		CHANNEL1_THREAD2
	]
}