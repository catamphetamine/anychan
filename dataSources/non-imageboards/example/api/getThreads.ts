import type { GetThreadsParameters, GetThreadsResult } from '@/types'

import { CHANNEL1, CHANNEL1_THREADS } from './data.js'

import { ChannelNotFoundError } from "../../../../src/api/errors/index.js"

const LATEST_COMMENTS_COUNT = 2

export async function getThreads({
	channelId,
	withLatestComments
}: GetThreadsParameters): Promise<GetThreadsResult> {
	if (channelId === CHANNEL1.id) {
		return {
			channel: CHANNEL1,
			threads: withLatestComments ? CHANNEL1_THREADS.map((thread) => ({
				...thread,
				// Just the "root" comment of the thread.
				comments: [thread.comments[0]],
				// "Latest comments", excluding the "root" comment of the thread.
				latestComments: thread.comments.slice(-LATEST_COMMENTS_COUNT).filter(_ => _.id !== thread.comments[0].id)
			})) : CHANNEL1_THREADS
		}
	}
	throw new ChannelNotFoundError({ channelId })
}