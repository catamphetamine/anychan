import { getThreads } from '../../redux/data.js'
import { resetState, setInitialLatestSeenThreadId, setChannelView, getSubscribedThreadIdsForChannel } from '../../redux/channel.js'
import { addFavoriteChannel } from '../../redux/favoriteChannels.js'

import onThreadsFetched from '../../utility/thread/onThreadsFetched.js'
import getLatestSeenThreadId from '../../utility/thread/getLatestSeenThreadId.js'

export default async function loadChannelPage({
	channelId,
	dispatch,
	settings,
	channelView,
	wasCancelled
}) {
	const {
		censoredWords,
		grammarCorrection,
		locale,
		autoSuggestFavoriteChannels
	} = settings

	const { channel, threads } = await dispatch(getThreads(channelId, {
		censoredWords,
		grammarCorrection,
		locale,
		withLatestComments: channelView === 'new-comments',
		sortByRating: channelView === 'popular'
	}))

	if (wasCancelled()) {
		return
	}

	onThreadsFetched(channelId, threads, { dispatch })

	if (autoSuggestFavoriteChannels !== false) {
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
	dispatch(setChannelView(channelView))
	// Set subscribed thread IDs.
	dispatch(getSubscribedThreadIdsForChannel({ channelId }))
}