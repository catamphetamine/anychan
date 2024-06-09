import type { DataSource, Channel } from '@/types'

import getChannelUrlPattern from './getChannelUrlPattern.js'

export default function getChannelUrl(dataSource: DataSource, { channelId, channelContainsExplicitContent }: Parameters) {
	return getChannelUrlPattern(dataSource, { channelContainsExplicitContent })
		.replace('{channelId}', channelId)
}

interface Parameters {
	channelId: Channel['id'];
	channelContainsExplicitContent: boolean;
}