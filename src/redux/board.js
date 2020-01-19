import { ReduxModule } from 'react-pages'

const redux = new ReduxModule()

export const setVirtualScrollerState = redux.simpleAction(
	(state, virtualScrollerState) => ({ ...state, virtualScrollerState })
)

export default redux.reducer()