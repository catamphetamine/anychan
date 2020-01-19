import { ReduxModule } from 'react-pages'

import UserData from '../UserData/UserData'

const redux = new ReduxModule('THREAD')

export const setVirtualScrollerState = redux.simpleAction(
	(state, virtualScrollerState) => ({ ...state, virtualScrollerState })
)

redux.on('CHAN', 'GET_THREAD_COMMENTS', (state, { thread, board }) => ({
  ...state,
	thread,
	board
}))

export default redux.reducer()