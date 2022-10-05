import { getThreads } from '../../redux/data.js'
import { resetState, setInitialLatestSeenThreadId, setChannelView, getSubscribedThreadIdsForChannel } from '../../redux/channel.js'
import { addFavoriteChannel } from '../../redux/favoriteChannels.js'

import onThreadsFetched from '../../utility/thread/onThreadsFetched.js'
import getLatestSeenThreadId from '../../utility/thread/getLatestSeenThreadId.js'

export default async function loadChannelPage({
	getState,
	dispatch,
	params: {
		channelId
	}
}) {
	const {
		censoredWords,
		grammarCorrection,
		locale,
		autoSuggestFavoriteChannels
	} = getState().settings.settings
	const { threads } = await dispatch(getThreads(channelId, {
		censoredWords,
		grammarCorrection,
		locale
	}))
	onThreadsFetched(channelId, threads, { dispatch })
	if (autoSuggestFavoriteChannels !== false) {
		const { channel } = getState().data
		dispatch(addFavoriteChannel({
			channel: {
				id: channel.id,
				title: channel.title
			}
		}))
	}
	// Reset a potentially previously set "instant back" state.
	dispatch(resetState())
	// Set initial state.
	dispatch(setInitialLatestSeenThreadId(getLatestSeenThreadId(channelId, threads)))
	// Set channel view.
	dispatch(setChannelView(getState().settings.settings.channelView))
	// Set subscribed thread IDs.
	dispatch(getSubscribedThreadIdsForChannel({ channelId }))
}