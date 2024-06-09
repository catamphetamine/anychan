import type { DataSource, Channel, Thread } from '@/types'

import getThreadUrlPattern from './getThreadUrlPattern.js'

export default function getThreadUrl(
	dataSource: DataSource,
	{ channelId, threadId, channelContainsExplicitContent }: {
		channelId: Channel['id'],
		threadId: Thread['id'],
		channelContainsExplicitContent: boolean
	}
) {
	return getThreadUrlPattern(dataSource, { channelContainsExplicitContent })
		.replace('{channelId}', channelId)
		.replace('{threadId}', String(threadId))
}
