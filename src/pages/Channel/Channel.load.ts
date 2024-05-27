import type { Dispatch } from 'redux';
import type { UserData, UserSettings, UserSettingsJson, DataSource, ChannelLayout, ChannelSorting, Channel, ChannelId, Thread } from '../../types/index.js'

import { setThreadsForChannel } from '../../redux/channel.js'

import {
	resetState,
	setInitialLatestSeenThreadId,
	setChannelLayout,
	setChannelSorting,
	setSubscribedThreadIdsForChannel
} from '../../redux/channelPage.js'

import onThreadsFetched from '../../utility/thread/onThreadsFetched.js'
import getLatestSeenThreadId from '../../utility/thread/getLatestSeenThreadId.js'

import getThreads from '../../api/getThreads.js'

import getMessages from '../../messages/getMessages.js'

export default async function loadChannelPage({
	channels,
	// `channel` object: either the current `channel` or a search result from `channels` list by ID.
	channelId,
	dispatch,
	userData,
	userSettings,
	dataSource,
	censoredWords,
	grammarCorrection,
	locale,
	originalDomain,
	channelLayout,
	channelSorting,
	wasCancelled
}: LoadChannelPageParameters) {
	// Loads a list of threads in the channel.
	const { threads, channel } = await getThreads({
		channelId,
		channelLayout,
		censoredWords,
		grammarCorrection,
		locale,
		originalDomain,
		messages: getMessages(locale),
		withLatestComments: channelLayout === 'threadsListWithLatestComments',
		sortByRating: channelSorting === 'popular',
		userData,
		userSettings,
		dataSource
	})

	// Updates the list of threads in page state in Redux store.
	dispatch(setThreadsForChannel({ channelId, channel, threads, channels }))

	// `dispatch(getThreads())` is not used in the app because it would
	// result in "race condition" errors here: the page would re-render
	// after `await dispatch(getThreads())` because it's "asynchronous",
	// so the page would be in an inconsistent state when it still has the old
	// `channelLayout` / `channelSorting` but at the same time it already has the new `threads`.
	//
	// The observed error would be:
	//
	// > [virtual-scroller] "onItemHeightDidChange()" has been called for item index 0
	//   but the item hasn't been rendered before.
	//
	// when switching between different `channelLayout` / `channelSorting` modes.
	//
	// const { threads } = await dispatch(getThreadsAction(channelId, {
	//  channelLayout,
	// 	censoredWords,
	// 	grammarCorrection,
	// 	locale,
	// 	userData,
	// 	userSettings,
	// 	withLatestComments: channelLayout === 'threadsListWithLatestComments',
	// 	sortByRating: channelSorting === 'popular'
	// }))

	if (wasCancelled()) {
		return
	}

	// Reset a potentially previously set "instant back" state.
	dispatch(resetState())
	// Set initial state.
	dispatch(setInitialLatestSeenThreadId(getLatestSeenThreadId(channelId, threads, { userData })))
	// Set channel layout.
	dispatch(setChannelLayout(channelLayout))
	// Set channel sorting.
	dispatch(setChannelSorting(channelSorting))
	// Set subscribed thread IDs.
	dispatch(setSubscribedThreadIdsForChannel({ channelId, userData }))

	// Peforms some additional actions after the channel has been loaded.
	onChannelPageLoaded({ channelId, threads, dispatch, userData })
}

interface LoadChannelPageParameters {
	channels?: Channel[];
	channel?: {
		id: string,
		title: string
	};
	channelId: string;
	dispatch: Dispatch;
	userData: UserData;
	userSettings: UserSettings;
	dataSource: DataSource;
	censoredWords: UserSettingsJson['censoredWords'];
	grammarCorrection: UserSettingsJson['grammarCorrection'];
	locale: UserSettingsJson['locale'];
	originalDomain?: string;
	channelLayout?: ChannelLayout;
	channelSorting?: ChannelSorting;
	wasCancelled: () => boolean;
}

// This function should be run after a channel page has been loaded.
// * If some of the fetched threads include a subscribed thread,
//   that subscribed thread's record gets updated with the new info.
// * If the list of threads is exhaustive and some subscribed thread is
//   absent from the list then it marks such subscribed thread as "removed".
export function onChannelPageLoaded({
	channelId,
	threads,
	dispatch,
	userData
}: {
		channelId: ChannelId,
		threads: Thread[],
		dispatch: Dispatch,
		userData: UserData
}) {
	onThreadsFetched(channelId, threads, { dispatch, userData })
}