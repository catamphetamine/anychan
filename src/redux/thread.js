import { ReduxModule } from 'react-pages'

const redux = new ReduxModule('THREAD')

export const setVirtualScrollerState = redux.simpleAction(
	(state, virtualScrollerState) => ({ ...state, virtualScrollerState })
)

export const setFromIndex = redux.simpleAction(
	(state, fromIndex) => ({ ...state, fromIndex, isInitialFromIndex: false })
)

export const setInitialFromIndex = redux.simpleAction(
	(state, fromIndex) => ({ ...state, fromIndex, isInitialFromIndex: true })
)

export const setInitialLatestReadCommentIndex = redux.simpleAction(
	(state, initialLatestReadCommentIndex) => ({ ...state, initialLatestReadCommentIndex })
)

export const setExpandAttachments = redux.simpleAction(
	(state, expandAttachments) => ({ ...state, expandAttachments })
)

export const updateCreateCommentState = redux.simpleAction(
	(state, createCommentStateUpdate) => ({
		...state,
		createCommentState: {
			...state.createCommentState,
			...createCommentStateUpdate
		}
	})
)

export const resetCreateCommentState = redux.simpleAction(
	(state, createCommentStateUpdate) => ({
		...state,
		createCommentState: undefined
	})
)

export const resetState = redux.simpleAction(
	(state) => ({})
)

export default redux.reducer()