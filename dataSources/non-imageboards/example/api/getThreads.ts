import type { GetThreadsParameters, GetThreadsResult } from '@/types'

import { CHANNEL1, CHANNEL1_THREAD1, CHANNEL1_THREAD2 } from './data.js'

import { ChannelNotFoundError } from "../../../../src/api/errors/index.js"

export async function getThreads({
	channelId
}: GetThreadsParameters): Promise<GetThreadsResult> {
	if (channelId === CHANNEL1.id) {
		return {
			channel: CHANNEL1,
			threads: [
				CHANNEL1_THREAD1,
				CHANNEL1_THREAD2
			]
		}
	}
	throw new ChannelNotFoundError({ channelId })
}