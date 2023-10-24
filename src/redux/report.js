import { ReduxModule } from 'react-pages'

import _reportComment from '../api/reportComment.js'

const redux = new ReduxModule()

export const reportComment = redux.action(
	({
		channelId,
		threadId,
		commentId,
		content,
		...rest
	}) => async http => {
		return await _reportComment({
			channelId,
			threadId,
			commentId,
			content,
			http,
			...rest
		})
	}
)

export const showReportCommentModal = redux.simpleAction(
	(state, {
		channelId,
		threadId,
		commentId
	}) => ({
		...state,
		showReportCommentModal: true,
		channelId,
		threadId,
		commentId
	})
)

export const hideReportCommentModal = redux.simpleAction(
	(state) => ({
		...state,
		showReportCommentModal: false
	})
)

export default redux.reducer({})