import type { GetTopChannelsParameters, GetTopChannelsResult } from '@/types'

import { CHANNEL1 } from './data.js'

export async function getTopChannels(): Promise<GetTopChannelsResult> {
	return {
		channels: [
			CHANNEL1
		]
	}
}