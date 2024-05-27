import type { DataSource, Channel } from '@/types'

import getChannelUrlPattern from './getChannelUrlPattern.js'

interface Parameters {
	channelId: Channel['id'];
	notSafeForWork: boolean;
}

export default function getChannelUrl(dataSource: DataSource, { channelId, notSafeForWork }: Parameters) {
	return getChannelUrlPattern(dataSource, { notSafeForWork })
		.replace('{channelId}', channelId)
}