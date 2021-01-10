import { ReduxModule } from 'react-pages'

const redux = new ReduxModule('CHANNEL')

export const setVirtualScrollerState = redux.simpleAction(
	(state, virtualScrollerState) => ({ ...state, virtualScrollerState })
)

export const setScrollPosition = redux.simpleAction(
	(state, scrollPosition) => ({ ...state, scrollPosition })
)

export const resetState = redux.simpleAction(
	(state) => ({})
)

export default redux.reducer()