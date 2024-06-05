import type { State, UserData, UserSettings, DataSource, Thread, UserSettingsJson, ChannelId, ThreadId } from '@/types'
import type { Location } from 'react-pages'
import type { Dispatch } from 'redux'
import type { TypedUseSelectorHook } from 'react-redux'

import {
	resetState,
	setInitialFromIndex,
	setInitialLatestReadCommentIndex
} from '../../redux/threadPage.js'

import getThread from '../../utility/thread/getThread.js'
import addSubscribedThread from '../../utility/subscribedThread/addSubscribedThread.js'
import getLatestReadCommentIndex from '../../utility/thread/getLatestReadCommentIndex.js'
import getMessages from '@/messages/getMessages.js'

import useSetting from '../../hooks/useSetting.js'

import getFromIndex from './getFromIndex.js'

export interface ThreadPageNavigationContext {
	subscribeToThread?: boolean
}

interface Parameters {
	useSelector: TypedUseSelectorHook<State>;
	dispatch: Dispatch;
	location: Location
	userData: UserData;
	userSettings: UserSettings;
	dataSource: DataSource;
	originalDomain?: string;
	params: {
		channelId: string,
		threadId: string
	},
	navigationContext?: ThreadPageNavigationContext
}

export default async function loadThreadPage({
	useSelector,
	dispatch,
	location,
	userData,
	userSettings,
	dataSource,
	originalDomain,
	params: {
		channelId,
		threadId: threadIdString
	},
	navigationContext
}: Parameters) {
	const threadId: Thread['id'] = Number(threadIdString)

	const useSetting_ = (getter: (settings: UserSettingsJson) => any) => useSetting(getter, { useSelector })

	const censoredWords = useSetting_(settings => settings.censoredWords)
	const grammarCorrection = useSetting_(settings => settings.grammarCorrection)
	const locale = useSetting_(settings => settings.locale)

	// `channels` is a just list of "top" channels and is not a complete list of channels.
	const channels = useSelector(state => state.channels.channels)

	// Fetches the thread.
	// Updates the thread's data in page state in Redux store.
	// Also performs some additional actions before or after the thread has been loaded.
	const { thread, channel } = await getThread(
		channelId,
		threadId,
		{
			channels,
			// `afterCommentId`/`afterCommentNumber` feature isn't currently used,
			// though it could potentially be used in some hypothetical future.
			// It would enable fetching only the "incremental" update
			// for the thread instead of fetching all of its comments.
			// afterCommentId,
			// afterCommentNumber,
			userData,
			userSettings,
			dataSource,
			censoredWords,
			grammarCorrection,
			messages: getMessages(locale),
			locale,
			originalDomain,
			dispatch,
			purpose: 'threadPageLoad'
		}
	)

	// Reset a potentially previously set "instant back" state.
	dispatch(resetState())

	// Set initial state.
	const latestReadCommentIndex = getLatestReadCommentIndex(thread, { userData })
	dispatch(setInitialLatestReadCommentIndex(latestReadCommentIndex))
	dispatch(setInitialFromIndex(getFromIndex({
		thread,
		location,
		latestReadCommentIndex
	})))

	// Peforms some additional actions after the thread has been loaded.
	onThreadPageLoaded({
		channelId,
		threadId,
		thread,
		navigationContext,
		userData,
		dispatch
	})
}

// This function should be run after a thread page has been loaded.
// * If `subscribeToThread: true` flag was passed during navigation,
//   it automatically subscribes to the thread.
// * This function doesn't include all the code that is run before or after
//   a thread has been loaded. For example, `await getThread()` function itself
//   performs some actions in its `onAfterThreadFetched()` function where it updates
//   global Redux state after looking at `thread` data. For example, if the thread is
//   a "subscribed" one and it doesn't exist then it marks the subscribed thread
//   record as `expired: true`, etc.
function onThreadPageLoaded({
	channelId,
	threadId,
	thread,
	navigationContext,
	userData,
	dispatch
}: {
	channelId: ChannelId
	threadId: ThreadId,
	thread: Thread,
	navigationContext?: {
		subscribeToThread?: boolean
	},
	userData: UserData,
	dispatch: Dispatch
}) {
	// When a user creates a new thread, the application navigates to this new thread's page.
	// In these cases, it might also be convenient to automatically subscribe the user to their new thread.
	if (navigationContext && navigationContext.subscribeToThread) {
		if (!userData.isSubscribedThread(channelId, threadId)) {
			addSubscribedThread({ thread, dispatch, userData })
		}
	}
}