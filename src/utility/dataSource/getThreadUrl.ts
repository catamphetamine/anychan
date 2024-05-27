import type { DataSource, Channel, Thread } from '@/types'

import getThreadUrlPattern from './getThreadUrlPattern.js'

export default function getThreadUrl(
	dataSource: DataSource,
	{ channelId, threadId, notSafeForWork }: {
		channelId: Channel['id'],
		threadId: Thread['id'],
		notSafeForWork: boolean
	}
) {
	return getThreadUrlPattern(dataSource, { notSafeForWork })
		.replace('{channelId}', channelId)
		.replace('{threadId}', String(threadId))
}
