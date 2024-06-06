import type { GetThreadParameters, GetThreadResult } from '@/types'

import { CHANNELS } from './data/index.js'

import { ChannelNotFoundError, ThreadNotFoundError } from '../../../../src/api/errors/index.js'

export async function getThread({
	channelId,
	threadId
}: GetThreadParameters): Promise<GetThreadResult> {
	const channel = CHANNELS.find(_ => _.id === channelId)

	if (!channel) {
		throw new ChannelNotFoundError({ channelId })
	}

	const thread = channel.threads.find(_ => _.id === threadId)

	if (!thread) {
		throw new ThreadNotFoundError({ channelId, threadId })
	}

	return {
		channel: {
			id: channel.id,
			title: channel.title
		},
		thread
	}
}