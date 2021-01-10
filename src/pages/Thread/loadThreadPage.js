import { getThread } from '../../redux/data'

import {
	resetState,
	setInitialFromIndex,
	setInitialLatestReadCommentIndex
} from '../../redux/thread'

import onThreadFetched from '../../utility/onThreadFetched'
import onThreadExpired from '../../utility/onThreadExpired'
import getLatestReadCommentIndex from '../../utility/getLatestReadCommentIndex'

import getFromIndex from './getFromIndex'

export default async function loadThreadPage({
	getState,
	dispatch,
	params: {
		channelId,
		threadId
	},
	location
}) {
	threadId = parseInt(threadId)
	const {
		censoredWords,
		grammarCorrection,
		locale
	} = getState().settings.settings
	try {
		const thread = await dispatch(getThread(channelId, threadId, {
			censoredWords,
			grammarCorrection,
			locale
		}))
		onThreadFetched(thread, { dispatch })
		// Reset a potentially previously set "instant back" state.
		dispatch(resetState())
		// Set initial state.
		const latestReadCommentIndex = getLatestReadCommentIndex(thread)
		dispatch(setInitialLatestReadCommentIndex(latestReadCommentIndex))
		dispatch(setInitialFromIndex(getFromIndex({
			getState,
			location,
			latestReadCommentIndex
		})))
	} catch (error) {
		if (error.status === 404) {
			// Clear expired thread from user data.
			onThreadExpired(channelId, threadId, { dispatch })
		}
		throw error
	}
}