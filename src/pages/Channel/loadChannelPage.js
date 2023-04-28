import { setChannelThreads } from '../../redux/data.js'
import { resetState, setInitialLatestSeenThreadId, setChannelView, getSubscribedThreadIdsForChannel } from '../../redux/channel.js'
import { addFavoriteChannel } from '../../redux/favoriteChannels.js'

import onThreadsFetched from '../../utility/thread/onThreadsFetched.js'
import getLatestSeenThreadId from '../../utility/thread/getLatestSeenThreadId.js'

import getThreads from '../../api/getThreads.js'

import getMessages from '../../messages/index.js'

import { getHttpClient } from 'react-pages'

export default async function loadChannelPage({
	channelId,
	dispatch,
	userData,
	userSettings,
	dataSource,
	getCurrentChannel,
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

	const threads = await getThreads({
		channelId,
		censoredWords,
		grammarCorrection,
		locale,
		messages: getMessages(locale),
		withLatestComments: channelView === 'new-comments',
		sortByRating: channelView === 'popular',
		http: getHttpClient(),
		userData,
		userSettings,
		dataSource
	})

	dispatch(setChannelThreads({ channelId, threads }))

	// `dispatch(getThreads())` is not used in the app because it would
	// result in "race condition" errors here: the page would re-render
	// after `await dispatch(getThreads())` because it's "asynchronous",
	// so the page would be in an inconsistent state when it still has the old
	// `channelView` but at the same time it already has the new `threads`.
	//
	// The observed error would be:
	//
	// > [virtual-scroller] "onItemHeightDidChange()" has been called for item index 0
	//   but the item hasn't been rendered before.
	//
	// when switching between different `channelView` modes.
	//
	// const { threads } = await dispatch(getThreadsAction(channelId, {
	// 	censoredWords,
	// 	grammarCorrection,
	// 	locale,
	// 	userData,
	// 	userSettings,
	// 	withLatestComments: channelView === 'new-comments',
	// 	sortByRating: channelView === 'popular'
	// }))

	const channel = getCurrentChannel()

	if (wasCancelled()) {
		return
	}

	onThreadsFetched(channelId, threads, { dispatch, userData })

	if (autoSuggestFavoriteChannels !== false) {
		dispatch(addFavoriteChannel({
			channel: {
				id: channel.id,
				title: channel.title
			},
			userData
		}))
	}

	// Reset a potentially previously set "instant back" state.
	dispatch(resetState())
	// Set initial state.
	dispatch(setInitialLatestSeenThreadId(getLatestSeenThreadId(channelId, threads, { userData })))
	// Set channel view.
	dispatch(setChannelView(channelView))
	// Set subscribed thread IDs.
	dispatch(getSubscribedThreadIdsForChannel({ channelId, userData }))
}