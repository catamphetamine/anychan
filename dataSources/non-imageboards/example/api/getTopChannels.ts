import type { GetTopChannelsParameters, GetTopChannelsResult } from '@/types'

import { CHANNELS } from './data/index.js'

import getChannelData from './utility/getChannelData.js'

export async function getTopChannels(): Promise<GetTopChannelsResult> {
	return {
		channels: CHANNELS.map(getChannelData)
	}
}