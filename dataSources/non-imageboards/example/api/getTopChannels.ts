import type { GetTopChannelsParameters, GetTopChannelsResult } from '@/types'

import { CHANNELS } from './data/index.js'

export async function getTopChannels(): Promise<GetTopChannelsResult> {
	return {
		channels: CHANNELS.map((channel) => ({
			id: channel.id,
			title: channel.title
		}))
	}
}