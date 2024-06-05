import type { GetThreadParameters, GetThreadResult } from '@/types'

import { CHANNEL1, CHANNEL1_THREAD1, CHANNEL1_THREAD2 } from './data.js'

import { ThreadNotFoundError } from "../../../../src/api/errors/index.js"

export async function getThread({
	channelId,
	threadId
}: GetThreadParameters): Promise<GetThreadResult> {
	if (channelId === CHANNEL1.id) {
		if (threadId === CHANNEL1_THREAD1.id) {
			return {
				channel: CHANNEL1,
				thread: CHANNEL1_THREAD1
			}
		} else  if (threadId === CHANNEL1_THREAD2.id) {
			return {
				channel: CHANNEL1,
				thread: CHANNEL1_THREAD2
			}
		}
	}
	throw new ThreadNotFoundError({ channelId, threadId })
}