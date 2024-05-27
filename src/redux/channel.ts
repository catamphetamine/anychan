import type { State, Channel, Thread } from '@/types'

import { ReduxModule } from 'react-pages'

import { getChannelObjectForChannelId, setThreadPropertiesFromChannelProperties } from './thread.js'

const redux = new ReduxModule<State['channel']>()

export const setThreadsForChannel = redux.simpleAction(
	(state, {
		channelId,
		channel: channel_,
		threads,
		channels
	}: {
		channelId: Channel['id'],
		// `channel` is the channel info that has been extracted from "get threads" API response.
		channel?: Channel,
		threads: Thread[],
		channels?: Channel[]
	}) => {
		// Get the current `channel`.
		const channel = getChannelObjectForChannelId(channelId, {
			channel: channel_,
			relatedChannel: state.channel,
			// `channels` are used as a backup source for channel info
			// when it's not present in "get threads" API response for some reason.
			// Although it is supposed to be present.
			channels
		})
		for (const thread of threads) {
			setThreadPropertiesFromChannelProperties(thread, channel)
		}
		return {
			...state,
			channel,
			threads
		}
	}
)

export default redux.reducer()