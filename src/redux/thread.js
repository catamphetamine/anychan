import { ReduxModule } from 'react-pages'

const redux = new ReduxModule('THREAD')

export const setVirtualScrollerState = redux.simpleAction(
	(state, virtualScrollerState) => ({ ...state, virtualScrollerState })
)

export const setScrollPosition = redux.simpleAction(
	(state, scrollPosition) => ({ ...state, scrollPosition })
)

export default redux.reducer()