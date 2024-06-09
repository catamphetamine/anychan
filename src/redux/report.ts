import type { State } from '@/types'

import { ReduxModule } from 'react-pages'

const redux = new ReduxModule<State['report']>()

export const showReportCommentModal = redux.simpleAction(
	(state, {
		channel,
		channelId,
		threadId,
		commentId,
		channelContainsExplicitContent
	}) => ({
		...state,
		showReportCommentModal: true,
		channel,
		channelId,
		threadId,
		commentId,
		channelContainsExplicitContent
	})
)

export const hideReportCommentModal = redux.simpleAction(
	(state) => ({
		...state,
		showReportCommentModal: false
	})
)

export default redux.reducer({})