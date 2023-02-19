import {
	resetState,
	setInitialFromIndex,
	setInitialLatestReadCommentIndex
} from '../../redux/thread.js'

import getThread from '../../utility/thread/getThread.js'
import getLatestReadCommentIndex from '../../utility/thread/getLatestReadCommentIndex.js'

import getFromIndex from './getFromIndex.js'

export default async function loadThreadPage({
	getState,
	dispatch,
	location,
	userData,
	userSettings,
	params: {
		channelId,
		threadId
	}
}) {
	threadId = Number(threadId)

	const {
		censoredWords,
		grammarCorrection,
		locale
	} = getState().settings.settings

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
		action: 'getThreadInState'
	})

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