import type { State } from '@/types'

import { ReduxModule } from 'react-pages'

const redux = new ReduxModule<State['report']>()

export const showReportCommentModal = redux.simpleAction(
	(state, {
		channelId,
		threadId,
		commentId,
		channelIsNotSafeForWork
	}) => ({
		...state,
		showReportCommentModal: true,
		channelId,
		threadId,
		commentId,
		channelIsNotSafeForWork
	})
)

export const hideReportCommentModal = redux.simpleAction(
	(state) => ({
		...state,
		showReportCommentModal: false
	})
)

export default redux.reducer({})