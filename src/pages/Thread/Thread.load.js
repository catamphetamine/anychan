import {
	resetState,
	setInitialFromIndex,
	setInitialLatestReadCommentIndex
} from '../../redux/thread.js'

import { subscribeToThread } from '../../redux/subscribedThreads.js'

import getThread from '../../utility/thread/getThread.js'
import getLatestReadCommentIndex from '../../utility/thread/getLatestReadCommentIndex.js'

import useSetting from '../../hooks/useSetting.js'

import getFromIndex from './getFromIndex.js'

export default async function loadThreadPage({
	useSelector,
	dispatch,
	location,
	userData,
	userSettings,
	dataSource,
	params: {
		channelId,
		threadId
	},
	navigationContext
}) {
	threadId = Number(threadId)

	const useSetting_ = (getter) => useSetting(getter, { useSelector })

	const censoredWords = useSetting_(settings => settings.censoredWords)
	const grammarCorrection = useSetting_(settings => settings.grammarCorrection)
	const locale = useSetting_(settings => settings.locale)

	const thread = await getThread({ channelId, threadId }, {
		// `afterCommentId`/`afterCommentsCount` feature isn't currently used,
		// though it could potentially be used in some hypothetical future.
		// It would enable fetching only the "incremental" update
		// for the thread instead of fetching all of its comments.
		// afterCommentId,
		// afterCommentsCount,
		censoredWords,
		grammarCorrection,
		locale
	}, {
		dispatch,
		userData,
		userSettings,
		dataSource,
		action: 'getThreadAndPutItInState'
	})

	// When a user creates a new thread, the application navigates to this new thread's page.
	// In these cases, it might also be convenient to automatically subscribe the user to their new thread.
	if (navigationContext && navigationContext.subscribeToThread) {
		if (!userData.isSubscribedThread(channelId, threadId)) {
			dispatch(subscribeToThread(thread, { userData }))
		}
	}

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
}