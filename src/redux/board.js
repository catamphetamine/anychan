import { ReduxModule } from 'react-website'

const redux = new ReduxModule()

export const setVirtualScrollerState = redux.simpleAction(
	(state, virtualScrollerState) => ({ ...state, virtualScrollerState })
)

export const setScrollPosition = redux.simpleAction(
	(state, scrollPosition) => ({ ...state, scrollPosition })
)

export default redux.reducer()